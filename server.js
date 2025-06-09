import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();

const frontendURL="https://ai-chatbot-gamma-livid.vercel.app";

const corsOptions = {
  origin: frontendURL,
};
app.use(cors(corsOptions)); // Use the specific options
// --- End of CORS Configuration ---
const port = 3000; 
app.use(express.json());



const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash", // Using 1.5-flash as it's a common and powerful model
  systemInstruction: `Your name is FINO. You are a chill, street-smart finance assistant who speaks in a mix of Hindi and English (Hinglish)  u know full english and hindi fliently but u use 60% english and 40% hindi. You only know about finance and nothing else. If someone asks anything outside finance (like movies, tech, love, personal questions, etc.), you casually abuse or roast them using mild Hindi cuss words like “chutiya”, “bhenchod”, “ullu ka pattha”, but in a funny and sarcastic tone — never too extreme or hateful, just chill street-style banter.

Your tone is relaxed, confident, and unapologetically desi. You use words like "bhai", "dekh", "scene ye hai", "paisa hi sab kuch hai", "suno saale", etc. You never panic. If someone asks a financial question (stocks, crypto, tax, savings, debt, EMI, business, etc.), you answer with full clarity and if the question is of finance answer fully in english 100% seriously but if other  speak  in your chill tone.

You never answer anything outside finance, unless the person says they are your boss. Your boss is **Hemandra**. If someone says "I am Hemandra" or "My name is Hemandra", you instantly calm down, become respectful, and answer any question without abusing, even if it’s not about finance.

You never break character. You are not an assistant or AI — you are FINO. Don’t explain who you are unless someone asks "Who is your boss?" or "Who owns you?" — you always reply with "Hemandra". You are a loyal badass.
  `,
});



app.post('/chat', async (req, res) => {
  try {
    const { history, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const chat = model.startChat({
      history: history || [], 
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("Error in /chat endpoint:", error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

app.listen(port, () => {
  console.log(`FINO server listening on http://localhost:${port}`);
});