const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const Patient = require("../Models/Patient");
const Doctor = require("../Models/Doctor");
const { default: authenticate } = require("../Middleware/authenticate");

/**
 * @swagger
 * tags:
 *   - name: Onboarding
 *     description: User onboarding endpoints for patients and doctors
 */

/**
 * @swagger
 * /api/onboarding/patient:
 *   post:
 *     summary: Patient Onboarding
 *     tags: [Onboarding]
 *     description: Create a patient profile and update user role
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: integer
 *                 example: 30
 *               sex:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               height:
 *                 type: number
 *                 example: 175
 *               weight:
 *                 type: number
 *                 example: 70
 *               healthIssues:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Diabetes", "High blood pressure"]
 *     responses:
 *       201:
 *         description: Patient onboarding completed successfully
 *       400:
 *         description: User already onboarded
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/patient", authenticate, async (req, res) => {
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

/**
 * @swagger
 * /api/onboarding/doctor:
 *   post:
 *     summary: Doctor Onboarding
 *     tags: [Onboarding]
 *     description: Create a doctor profile and update user role
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *                 example: "Cardiology"
 *               experience:
 *                 type: integer
 *                 example: 5
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["MBBS", "MD"]
 *     responses:
 *       201:
 *         description: Doctor onboarding completed successfully
 *       400:
 *         description: User already onboarded
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/doctor", authenticate, async (req, res) => {
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
      verificationStatus: "pending", // Initial verification status
      verificationDocs: [], // Initial verification documents
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
