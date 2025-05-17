import { getGroqResponse } from '../services/groqService.js';

export const handleChat = async (req, res) => {
  const { message, history } = req.body;

  try {
    const response = await getGroqResponse(message, history);
    res.json({ reply: response });
  } catch (error) {
console.error('ChatController Error:', error);  // Add this
res.status(500).json({ error: 'Something went wrong', details: error.message });  }
};
