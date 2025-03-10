const express = require("express");
const axios = require("axios");
const { default: authenticate } = require("../Middleware/authenticate");
require("dotenv").config();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: AI-powered chatbot endpoints
 */

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat with AI Assistant
 *     tags: [Chat]
 *     description: Sends a message to the AI chatbot and gets a response.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "What is the capital of France?"
 *     responses:
 *       200:
 *         description: AI-generated response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "The capital of France is Paris."
 *       400:
 *         description: Message is required
 *       500:
 *         description: Failed to fetch response from OpenAI
 */
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
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // ✅ Secure API Key
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
