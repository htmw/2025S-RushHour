const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const JWT_SECRET = process.env.JWT_SECRET;
const { v4: uuidv4 } = require("uuid");
const ResetToken = require("../Models/ResetToken");
const crypto = require("crypto");
const { sendEmail } = require("../utils/emailService");
const { FRONTEND_URL } = require("../config");
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

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     description: Sends a password reset link to the user's email address.
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
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset link sent successfully"
 *       400:
 *         description: Email is required
 *       500:
 *         description: Server error
 *
 */
router.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Extract the name from the email (before the '@')
    const name = email.split("@")[0];

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token in MongoDB (upsert to avoid duplicates)
    await ResetToken.findOneAndUpdate(
      { email },
      { token: resetToken, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Construct Reset Link
    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

    // Send Email using Mustache Template
    await sendEmail(email, "Password Reset Request", "forgotPassword", {
      name,
      resetLink,
    });

    res.json({ message: `Password reset email sent to ${email}` });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @swagger
 * /api/auth/verify-reset-token:
 *   post:
 *     summary: Verify password reset token
 *     tags: [Authentication]
 *     description: Verifies if the provided token is valid and not expired.
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
 *               token:
 *                 type: string
 *                 example: "valid_token"
 *     responses:
 *       200:
 *         description: Token verified, proceed with reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token verified, proceed with reset"
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
router.post("/auth/verify-reset-token", async (req, res) => {
  const { email, token } = req.body;

  try {
    // Check if the token exists in the database
    const resetEntry = await ResetToken.findOne({ email, token });

    if (!resetEntry) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.json({ message: "Token verified, proceed with reset" });
  } catch (err) {
    console.error("Token Verification Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 *  @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     description: Resets the user's password using the provided token and new password.
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
 *               token:
 *                 type: string
 *                 example: "valid_token"
 *               newPassword:
 *                 type: string
 *                 example: "new_password"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successful"
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
router.post("/auth/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;
  console.log(email, token, newPassword);
  try {
    const resetEntry = await ResetToken.findOne({ email, token });
    if (!resetEntry)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    await ResetToken.deleteOne({ email });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * Generates a JWT token for the given user.
 * @param {Object} user - User object containing id, email, fullName, and isOnboarded
 * @returns {string} - JWT token
 */
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
