const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const JWT_SECRET = process.env.JWT_SECRET;
const { v4: uuidv4 } = require("uuid");

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *       400:
 *         description: Invalid credentials or missing fields
 *       500:
 *         description: Server error
 */
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

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

/**
 * @swagger
 * /api/auth/oauth:
 *   post:
 *     summary: OAuth authentication
 *     tags: [Authentication]
 *     description: Logs in a user via OAuth provider (Google, Facebook, etc.) and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               userId:
 *                 type: string
 *                 example: "oauth_user_12345"
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               provider:
 *                 type: string
 *                 example: "Google"
 *     responses:
 *       200:
 *         description: Successfully authenticated via OAuth
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
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
    if (err.code === 11000) {
      // ✅ Handle duplicate key error
      console.error("OAuth Auth Error: Duplicate User", err);
      return res.status(400).json({ message: "User already exists" });
    }

    console.error("OAuth Auth Error:", err.message, err.stack);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Creates a new user account and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: User already exists or missing required fields
 *       500:
 *         description: Server error
 */
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

function generateToken(user) {
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
}

module.exports = router;
