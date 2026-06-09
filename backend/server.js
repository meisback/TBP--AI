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
