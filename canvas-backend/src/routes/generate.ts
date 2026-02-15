import express, { Router } from "express";
import rateLimit from "express-rate-limit";
import { GoogleGenerativeAI } from "@google/generative-ai"; // npm install @google/generative-ai
import { authMiddleware } from "../middleware/auth.js"
import dotenv from "dotenv";
import { prompt_generator } from "../utils/promptGenerator.js";

dotenv.config();

const generate_router: Router = express.Router();

// 1. Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY missing");

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

// 2. AI Rate Limiter (Strict: 10 requests/hour to save cost)
const genLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10,
    message: { message: "AI Limit reached. Try again in an hour." }
});

// 3. The Route
generate_router.post("/", genLimiter, async (req, res) => {
    try {
        const prompt = req.body.prompt;
        console.log(prompt)
        if (!prompt) return res.status(400).json({ message: "Prompt is required" });
        if (prompt.length > 3000) return res.status(400).json({ message: "Prompt too long" });

        // 4. THE SYSTEM PROMPT (Magic Sauce)
        // We instruct AI to act as a geometry engine, not a chatbot.


        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 5. Clean up the response (Remove ```json ... ``` if AI adds it)
        const cleanJson = text.replace(/```json|```/g, "").trim();

        res.json({ result: JSON.parse(cleanJson) });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: "Failed to generate drawing" });
    }
});

export default generate_router;