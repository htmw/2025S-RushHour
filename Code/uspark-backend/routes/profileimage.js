const express = require("express");
const upload = require("../Middleware/upload");
const User = require("../Models/User");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Profile Image
 *     description: Endpoints related to profile image upload
 */

/**
 * @swagger
 * /api/upload-profile-image:
 *   post:
 *     summary: Upload a profile image
 *     tags: [Profile Image]
 *     description: Upload a profile image for a user and store the image URL in the database.
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
 *               userId:
 *                 type: string
 *                 example: "65f4c3bdf1a3d7a9e9a4d8c2"
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
 *                   example: "https://s3.amazonaws.com/bucket-name/image.jpg"
 *       400:
 *         description: No file uploaded
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/", upload.single("profileImage"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    const { userId } = req.body;
    const imageUrl = req.file.location; // S3 file URL

    const user = await User.findOneAndUpdate(
      { userId: userId },
      { image: imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Error while uploading image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
