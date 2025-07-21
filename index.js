import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5500/', // frontend URL
    'X-Title': 'AI-Based Health Monitor',
  },
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const response = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct', // Or try 'meta-llama/llama-3-8b-instruct'
      messages: [
        { role: 'system', content: 'You are a helpful AI that gives simple health suggestions based on symptoms.' },
        { role: 'user', content: message },
      ],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong with AI response.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
