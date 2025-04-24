const express = require("express");
const User = require("../Models/User");
const Patient = require("../Models/onBoarding/Patient");
const Doctor = require("../Models/onBoarding/Doctor");
const { default: authenticate } = require("../Middleware/authenticate");
const { getS3SignedUrl } = require("../Middleware/s3");
const router = express.Router();
const { AWS_BUCKET_RUSH_HOUR_UPLOADS } = require("../config.js");

/**
 * @swagger
 * tags:
 *   - name: Profile
 *     description: Endpoints for fetching user Profile data and doctor verification
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get profile data
 *     tags: [profile]
 *     description: Retrieve the profile details of the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "65f4c3bdf1a3d7a9e9a4d8c2"
 *                 fullName:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 role:
 *                   type: string
 *                   enum: [patient, doctor]
 *                   example: "doctor"
 *                 isOnboarded:
 *                   type: boolean
 *                   example: true
 *                 specialization:
 *                   type: string
 *                   example: "Cardiology"
 *                 verificationStatus:
 *                   type: string
 *                   enum: [pending, approved, rejected]
 *                   example: "pending"
 *       401:
 *         description: Unauthorized - Invalid or missing token.
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, async (req, res) => {
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
        profileData = {
          ...profileData,
          ...doctorDetails._doc,

          verificationStatus: doctorDetails.verificationStatus, // Will send verification status
          verificationDocs:
            doctorDetails.verificationStatus === "pending"
              ? doctorDetails.verificationDocs
              : [], // Hide docs after approval
        };
    }

    res.json(profileData);
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @swagger
 * /api/profile/patient:
 *   post:
 *     summary: Update patient profile
 *     tags: [Profile]
 *     description: Save or update the authenticated patient's profile information.
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
 *                 type: number
 *                 example: 28
 *               sex:
 *                 type: string
 *                 example: "Male"
 *               height:
 *                 type: number
 *                 example: 180
 *               weight:
 *                 type: number
 *                 example: 75
 *               healthIssues:
 *                 type: string
 *                 example: "None"
 *     responses:
 *       200:
 *         description: Patient profile updated
 *       500:
 *         description: Internal Server Error
 */
router.post("/patient", authenticate, async (req, res) => {
  try {
    const { age, sex, height, weight, healthIssues } = req.body;

    let patient = await Patient.findOne({ userId: req.user.userId });
    if (!patient) patient = new Patient({ userId: req.user.userId });

    Object.assign(patient, { age, sex, height, weight, healthIssues });
    await patient.save();

    res.status(200).json({ message: "Patient profile updated", patient });
  } catch (error) {
    console.error("Error updating patient profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/profile/doctor/update:
 *   post:
 *     summary: Update doctor profile
 *     tags: [Profile]
 *     description: Update the authenticated doctor's profile information.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Dr. Jane Doe"
 *               specialization:
 *                 type: string
 *                 example: "Dermatology"
 *               experience:
 *                 type: number
 *                 example: 7
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["MBBS", "MD Dermatology"]
 *     responses:
 *       200:
 *         description: Doctor profile updated successfully
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Server Error
 */
router.post("/doctor/update", authenticate, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const { fullName, specialization, experience, certifications } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName },
      { new: true }
    );

    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience || doctor.experience;
    doctor.certifications = certifications || doctor.certifications;

    await doctor.save();

    res.status(200).json({
      message: "Profile updated successfully",
      doctor: {
        fullName: user.fullName,
        ...doctor._doc,
      },
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * @swagger
 * /api/profile/doctor/availability:
 *   post:
 *     summary: Save doctor availability
 *     tags: [Profile]
 *     description: Save availability slots for the authenticated doctor.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2025-04-08"
 *                     startTime:
 *                       type: string
 *                       example: "09:00"
 *                     endTime:
 *                       type: string
 *                       example: "12:00"
 *                     slotDuration:
 *                       type: number
 *                       example: 30
 *     responses:
 *       200:
 *         description: Availability saved successfully
 *       500:
 *         description: Server Error
 */
router.post("/doctor/availability", authenticate, async (req, res) => {
  try {
    const { slots } = req.body;

    const doctor = await Doctor.findOne({ userId: req.user.userId });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.availability = slots.map((slot) => ({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      slotDuration: slot.slotDuration,
      mode: slot.mode || "both", // default to both if not provided
    }));
    await doctor.save();

    res.status(200).json({
      message: "Availability saved successfully",
      availability: doctor.availability,
    });
  } catch (err) {
    console.error("Error saving availability:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @swagger
 * /api/profile/doctor/availability:
 *   get:
 *     summary: Get doctor availability
 *     tags: [Profile]
 *     description: Retrieve availability slots for the authenticated doctor.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor availability retrieved
 *       500:
 *         description: Server Error
 */
router.get("/doctor/availability", authenticate, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json({ availability: doctor.availability });
  } catch (err) {
    console.error("Error fetching availability:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @swagger
 * /api/profile/doctor/availability/{id}:
 *   put:
 *     summary: Update specific availability slot
 *     tags: [Profile]
 *     description: Update a single availability slot by ID for the authenticated doctor.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the availability slot to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-08"
 *               startTime:
 *                 type: string
 *                 example: "10:00"
 *               endTime:
 *                 type: string
 *                 example: "13:00"
 *               slotDuration:
 *                 type: number
 *                 example: 30
 *     responses:
 *       200:
 *         description: Slot updated successfully
 *       404:
 *         description: Slot or doctor not found
 *       500:
 *         description: Server Error
 */
router.put("/doctor/availability/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, slotDuration, mode } = req.body;

    const doctor = await Doctor.findOne({ userId: req.user.userId });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const slot = doctor.availability.id(id);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    // Update fields
    slot.date = date;
    slot.startTime = startTime;
    slot.endTime = endTime;
    slot.slotDuration = slotDuration;
    slot.mode = mode || slot.mode; // fallback to previous if mode not passed

    await doctor.save();

    res.status(200).json({
      message: "Slot updated successfully",
      availability: doctor.availability,
    });
  } catch (err) {
    console.error("Error updating slot:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @swagger
 * /api/profile/signed-url:
 *   get:
 *     summary: Get signed S3 URL for file upload
 *     tags: [Profile]
 *     description: Generate a signed S3 URL for secure file uploads.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key (filename) for which to generate the signed URL
 *     responses:
 *       200:
 *         description: Signed URL generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://bucket.s3.amazonaws.com/key?signature=abc"
 *       500:
 *         description: Server Error
 */
router.get("/signed-url", authenticate, async (req, res) => {
  const { key } = req.query;
  const signedUrl = await getS3SignedUrl(key, AWS_BUCKET_RUSH_HOUR_UPLOADS); // your S3 util function
  res.json({ url: signedUrl });
});

module.exports = router;
