const express = require("express");
const router = express.Router();
const ChatHistory = require("../Models/ChatHistory"); // Reusing ChatHistory model
const { default: authenticate } = require("../Middleware/authenticate");

/**
 * @swagger
 * tags:
 *   - name: Assessments
 *     description: APIs for managing user assessments (chat history)
 */

/**
 * @swagger
 * /api/assessments:
 *   get:
 *     summary: Get all assessments (chat history) for the logged-in user
 *     tags: [Assessments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of assessments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const assessments = await ChatHistory.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ message: "Failed to fetch assessments" });
  }
});

/**
 * @swagger
 * /api/assessments/{id}:
 *   delete:
 *     summary: Delete an assessment (chat history) by ID
 *     tags: [Assessments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the assessment to delete
 *     responses:
 *       200:
 *         description: Assessment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Assessment not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const assessment = await ChatHistory.findOneAndDelete({ _id: id, userId });
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.status(200).json({ message: "Assessment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assessment:", error);
    res.status(500).json({ message: "Failed to delete assessment" });
  }
});

module.exports = router;
