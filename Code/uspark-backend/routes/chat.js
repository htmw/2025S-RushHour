const express = require("express");
const axios = require("axios");
const { default: authenticate } = require("../Middleware/authenticate");
require("dotenv").config();

const router = express.Router();

// ✅ Route: POST /api/chat
router.post("/", authenticate, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `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`,
        },
      }
    );

    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Failed to fetch response from OpenAI" });
  }
});

module.exports = router;
