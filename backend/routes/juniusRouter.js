console.log("🧭 juniusRouter.js loaded");
const express = require('express');
const { callChatGPT, callGemini } = require('../aiHandlers/aiPipeline.js');
const { getAgeTier } = require('../utils/ageTier.js');
const { filterBadInput } = require('../filters/inputFilter.js');

const router = express.Router();

router.post('/ask', async (req, res) => {
  console.log('✅ /api/ask route hit');
  console.log('Incoming request body:', req.body);

  const { question, age, history = [] } = req.body;

  // Basic payload validation
  if (typeof question !== 'string' || typeof age === 'undefined') {
    return res.status(400).json({ message: 'Both "question" (string) and "age" are required.' });
  }

  const numericAge = Number(age);
  if (Number.isNaN(numericAge) || numericAge < 0) {
    return res.status(400).json({ message: '"age" must be a valid non-negative number.' });
  }

  try {
    console.log('🧼 Running input filter...');
    if (!filterBadInput(question)) {
      console.log('❌ Blocked inappropriate input.');
      return res.status(400).json({ message: 'Try asking something else.' });
    }
  } catch (err) {
    console.error('❌ Error in filterBadInput:', err);
    return res.status(500).json({ message: 'Input filter failed.' });
  }

  let tier;
  try {
    console.log('🎚️ Determining age tier...');
    tier = getAgeTier(numericAge);
    console.log('✅ Tier:', tier);
    // Combine past conversation into full prompt
    const plainHistory = history
      .map(item => item.replace(/<[^>]+>/g, '').trim())
      .filter(Boolean)
      .join('\n');
    var fullPrompt = plainHistory
      ? `${plainHistory}\nUser: ${question}`
      : question;
  } catch (err) {
    console.error('❌ Error in getAgeTier:', err);
    return res.status(500).json({ message: 'Age tier failed.' });
  }

  let gptResponse;
  try {
    console.log('🤖 Calling ChatGPT...');
    gptResponse = await callChatGPT(fullPrompt);
    console.log('🧠 GPT Response:', gptResponse);
  } catch (err) {
    console.error('❌ Error in callChatGPT:', err);
    return res.status(500).json({ message: 'ChatGPT failed.' });
  }

  let finalResponse;
  try {
    console.log('🧠 Calling Gemini...');
    finalResponse = await callGemini(gptResponse, tier);
    console.log('💡 Gemini Response:', finalResponse);
  } catch (err) {
    console.error('❌ Error in callGemini:', err);
    return res.status(500).json({ message: 'Gemini failed.' });
  }

  console.log('✅ Sending response to client...');
  res.json({ response: finalResponse });
});

module.exports = router;