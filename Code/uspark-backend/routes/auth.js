const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      isOnboarded: user.isOnboarded,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};
// ✅ Normal Signup/Login Route
router.post("/auth", async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ email, fullName, password: hashedPassword });
      await user.save();
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ OAuth Signup/Login Route
router.post("/auth/oauth", async (req, res) => {
  const { email, userId, fullName, provider } = req.body;

  if (!email || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        userId,
        email,
        fullName,
        provider,
      });
      await user.save();
    }

    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    console.error("OAuth Auth Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
