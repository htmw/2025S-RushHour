const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const Patient = require("../Models/onBoarding/Patient");
const Doctor = require("../Models/onBoarding/Doctor");
const HealthIssue = require("../Models/onBoarding/HealthIssue");
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

/**
 * @swagger
 * /api/onBoarding/health-issues:
 *   get:
 *     summary: Retrieve health issues with search functionality
 *     tags: [Health Issues]
 *     description: Fetches health issues matching the input query (at least 3 characters required).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search for health issues by name (min 3 characters)
 *     responses:
 *       200:
 *         description: List of matching health issues retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/health-issues", authenticate, async (req, res) => {
  try {
    const { search } = req.query;
    console.log({ search });
    // Fetch only if at least 3 characters are entered
    if (!search || search.length < 3) {
      return res.status(200).json([]);
    }

    const issues = await HealthIssue.find({
      health_issue: { $regex: search, $options: "i" },
    });

    console.log({ issues });

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error fetching health issues:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/onBoarding/health-issues:
 *   post:
 *     summary: Add a new health issue if it doesn't exist
 *     tags: [Health Issues]
 *     description: Creates a new health issue if not found in the database.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               health_issue:
 *                 type: string
 *                 example: "Migraine"
 *     responses:
 *       201:
 *         description: Health issue added successfully
 *       400:
 *         description: Health issue already exists
 *       500:
 *         description: Server error
 */
router.post("/health-issues", authenticate, async (req, res) => {
  const { health_issue } = req.body;

  try {
    const existingIssue = await HealthIssue.findOne({ health_issue });
    if (existingIssue) {
      return res.status(400).json({ message: "Health issue already exists" });
    }

    const newIssue = new HealthIssue({ health_issue });
    await newIssue.save();

    res
      .status(201)
      .json({ message: "Health issue added successfully", newIssue });
  } catch (err) {
    console.error("Error adding health issue:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
