import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// your existing function
export const getGroqResponse = async (message, history = []) => {
  try {
    const messages = [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      ...history,
      { role: 'user', content: message },
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama3-70b-8192', // ✅ fixed model name
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw error;
  }
};
