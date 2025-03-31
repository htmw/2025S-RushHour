const express = require("express");
const createUploadMiddleware = require("../Middleware/upload");
const { default: authenticate } = require("../Middleware/authenticate");
const User = require("../Models/User");
const { AWS_BUCKET_PUBLIC_USPARK_DOCS } = require("../config.js");
const router = express.Router();
const upload = createUploadMiddleware(
  "profile-images",
  AWS_BUCKET_PUBLIC_USPARK_DOCS
);
/**
 * @swagger
 * tags:
 *   - name: Profile Image
 *     description: Endpoints related to profile image upload and retrieval
 */

/**
 * @swagger
 * /api/profile-image:
 *   get:
 *     summary: Fetch profile image URL for the logged-in user
 *     tags: [Profile Image]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched profile image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   example: "https://s3.amazonaws.com/bucket/image.jpg"
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ image: user.image || null });
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/profile-image:
 *   post:
 *     summary: Upload profile image
 *     tags: [Profile Image]
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image uploaded successfully"
 *                 imageUrl:
 *                   type: string
 *                   example: "https://s3.amazonaws.com/bucket/image.jpg"
 *       400:
 *         description: No file uploaded
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  authenticate,
  upload.single("profileImage"),
  async (req, res) => {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded." });

    try {
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { image: req.file.location },
        { new: true }
      );

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: user.image,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
