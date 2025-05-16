import express from "express";
import cors from "cors";
import 'dotenv/config';
import chatRoutes from './routes/chatRoutes.js';
import { groq } from './services/groqService.js'; // ✅ Make sure this is imported


const app = express();
const PORT = process.env.PORT || 5000;




app.get('/test', async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Hello" }],
      model: "llama3-70b-8192", // ✅ correct model name
    });
res.json({ reply: completion.choices[0]?.message?.content || '' });
  } catch (error) {
    console.error('Groq test error:', error);
    res.status(500).json({ error: error.message });
  }
});




// Middleware
app.use(cors());
app.use(express.json());

// Register Routes
app.use('/api/message', chatRoutes);

app.get('/test', async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Hello" }],
      model: "llama3-70b-8192", // ✅ correct model name (no dash)
    });
    res.json(completion);
  } catch (error) {
    console.error('Groq test error:', error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
