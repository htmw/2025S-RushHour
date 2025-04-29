/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: APIs related to saving and managing chatbot sessions and messages
 */

const express = require("express");
const ChatHistory = require("../Models/ChatHistory"); // Make sure you have this model
const { default: authenticate } = require("../Middleware/authenticate");
const router = express.Router();

/**
 * @swagger
 * /api/chat/save:
 *   post:
 *     summary: Save a chat session and its messages
 *     tags: [Chat]
 *     description: Saves the full chatbot conversation (user and bot messages) for a user session.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user who owns the session
 *               sessionId:
 *                 type: string
 *                 description: Unique session ID
 *               messages:
 *                 type: array
 *                 description: Array of message objects
 *                 items:
 *                   type: object
 *                   properties:
 *                     sender:
 *                       type: string
 *                       enum: [user, bot]
 *                     text:
 *                       type: string
 *     responses:
 *       201:
 *         description: Chat history saved successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server Error
 */
router.post("/save", authenticate, async (req, res) => {
  try {
    console.log("✅ Incoming Save Chat Request");
    console.log("Request Body:", req.body);
    console.log("Authenticated User:", req.user);

    const { sessionId, messages } = req.body;

    if (!sessionId || !messages) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const chatHistory = new ChatHistory({
      userId: req.user.userId,
      sessionId,
      messages,
    });

    await chatHistory.save();

    console.log("✅ Chat saved successfully to MongoDB");
    res.status(201).json({ message: "Chat history saved successfully" });
  } catch (error) {
    console.error(
      "❌ Error saving chat history:",
      error.stack || error.message
    );
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
