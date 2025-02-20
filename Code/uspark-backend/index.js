require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./Models/User");
const onBoardingRoutes = require("./routes/onboarding");
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ✅ Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, fullName: user.fullName },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// ✅ Normal Signup/Login Route
app.post("/auth", async (req, res) => {
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
app.post("/auth/oauth", async (req, res) => {
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

    const token = jwt.sign(
      { userId: user._id, email: user.email, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("OAuth Auth Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/users/:userId/onboard", async (req, res) => {
  const { userId } = req.params;
  const { role, onboardingData } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { role, onboardingData, isOnboarded: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Onboarding completed", user });
  } catch (error) {
    console.error("Onboarding Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Protected Route Example
app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    res.json({ message: "Protected data", user: decoded });
  });
});

app.use("/api", onBoardingRoutes);

// ✅ Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
