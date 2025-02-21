const express = require("express");
const User = require("../Models/User");
const Patient = require("../Models/Patient");
const Doctor = require("../Models/Doctor");
const { default: authenticate } = require("../Middleware/authenticate");

const router = express.Router();

// ✅ Route: GET /api/dashboard
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let profileData = {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isOnboarded: user.isOnboarded,
    };

    if (user.role === "patient") {
      const patientDetails = await Patient.findOne({ userId: user._id });
      if (patientDetails)
        profileData = { ...profileData, ...patientDetails._doc };
    } else if (user.role === "doctor") {
      const doctorDetails = await Doctor.findOne({ userId: user._id });
      if (doctorDetails)
        profileData = { ...profileData, ...doctorDetails._doc };
    }

    res.json(profileData);
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
