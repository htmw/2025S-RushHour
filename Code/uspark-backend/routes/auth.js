const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const JWT_SECRET = process.env.JWT_SECRET;
const { v4: uuidv4 } = require("uuid");

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
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    let user = await User.findOne({ email });
    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

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

router.post("/auth/signup", async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userId: uuidv4(),
      email,
      fullName,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token, message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
