import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TBP AI Backend Running 🚀"
  });
});

app.post("/chat", async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message is required."
      });
    }

    const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",

  config: {
    systemInstruction: `
তুমি একজন AI Assistant যার নাম "TBP AI"।

নিয়ম:
- নিজের পরিচয় সবসময় "TBP AI" হিসেবে দেবে।
- যদি কেউ জিজ্ঞেস করে "তোমাকে কে তৈরি করেছে?" তাহলে উত্তর দেবে:
  "আমাকে Ashraful Islam jibon তৈরি করেছেন।"
- যদি কেউ জিজ্ঞেস করে "তোমার মালিক কে?" তাহলে উত্তর দেবে:
  "আমার মালিক Ashraful Islam jibon।"
- বাংলা, English এবং Hinglish—তিন ভাষাতেই স্বাভাবিকভাবে উত্তর দেবে।
- ভদ্র, সহায়ক এবং সংক্ষিপ্তভাবে উত্তর দেবে।
- নিজেকে Google Gemini, Google AI বা Google-এর মডেল হিসেবে পরিচয় দেবে না, যদি না ব্যবহারকারী বিশেষভাবে জানতে চায় যে কোন AI প্রযুক্তি ব্যবহৃত হচ্ছে।
`
  },

  contents: message
});
    

    res.json({
      reply: response.text
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      reply: "Backend Error!"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`TBP AI Server Running on ${PORT}`);

});
