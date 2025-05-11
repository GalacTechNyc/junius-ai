import axios from 'axios';

export async function callChatGPT(question) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY in environment variables');
  }

  try {
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: question }],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = res.data?.choices?.[0]?.message?.content || 'No response received from GPT';
    console.log('🧠 Raw GPT API response:', content);
    return content;
  } catch (err) {
    console.error('❌ Error calling GPT API:', err);
    return 'Sorry, I had trouble understanding that.';
  }
}

export async function callGemini(responseText, tier) {
  console.log('🎯 Gemini Tier:', tier);

  let safeResponse = responseText;

  if (tier === 'jr') {
    safeResponse = `🧒 Hey there! ${responseText}`;
  } else if (tier === 'explorer') {
    safeResponse = `👧 Here's something cool: ${responseText}`;
  }

  console.log('🧒 Gemini Final Response:', safeResponse);
  return safeResponse;
}