const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const Patient = require("../Models/Patient");
const Doctor = require("../Models/Doctor");
const { default: authenticate } = require("../Middleware/authenticate");

router.post("/onboarding/patient", authenticate, async (req, res) => {
  const { age, sex, height, weight, healthIssues } = req.body;
  console.log({ age, sex, height, weight, healthIssues });

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isOnboarded)
      return res.status(400).json({ message: "User already onboarded" });

    // ✅ Create Patient Profile
    const newPatient = new Patient({
      userId: user._id,
      age,
      sex,
      height,
      weight,
      healthIssues,
    });

    await newPatient.save();

    // ✅ Update User Model
    user.role = "patient";
    user.isOnboarded = true;
    await user.save();

    res.status(201).json({ message: "Patient onboarding completed" });
  } catch (err) {
    console.error("Patient Onboarding Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

//  Doctor Onboarding Route
router.post("/onboarding/doctor", authenticate, async (req, res) => {
  const { specialization, experience, certifications } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isOnboarded)
      return res.status(400).json({ message: "User already onboarded" });

    // ✅ Create Doctor Profile
    const newDoctor = new Doctor({
      userId: user._id,
      specialization,
      experience,
      certifications,
      verificationStatus: "pending",  // Initial verification status
      verificationDocs: [],  // Initial verification documents
    });

    await newDoctor.save();

    // ✅ Update User Model
    user.role = "doctor";
    user.isOnboarded = true;
    await user.save();

    res.status(201).json({ message: "Doctor onboarding completed" });
  } catch (err) {
    console.error("Doctor Onboarding Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
