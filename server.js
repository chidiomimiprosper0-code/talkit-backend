// backend.js
import express from "express";
import multer from "multer";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Replace with your actual OpenAI API key
const OPENAI_API_KEY = "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";

// AI text response
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        stream: false
      })
    });
    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI request failed" });
  }
});

// Image upload
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));