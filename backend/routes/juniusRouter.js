console.log("🧭 juniusRouter.js loaded");
const express = require('express');
const { callChatGPT, callGemini } = require('../aiHandlers/aiPipeline.js');
const { getAgeTier } = require('../utils/ageTier.js');
const { filterBadInput } = require('../filters/inputFilter.js');

const router = express.Router();

router.post('/ask', async (req, res) => {
  console.log('✅ /api/ask route hit');
  console.log('Incoming request body:', req.body);

  const { question, age } = req.body;

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
    tier = getAgeTier(age);
    console.log('✅ Tier:', tier);
  } catch (err) {
    console.error('❌ Error in getAgeTier:', err);
    return res.status(500).json({ message: 'Age tier failed.' });
  }

  let gptResponse;
  try {
    console.log('🤖 Calling ChatGPT...');
    gptResponse = await callChatGPT(question);
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