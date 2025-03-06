const express = require("express");
const upload = require("../Middleware/upload");
const User = require("../Models/User");

const router = express.Router();

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
