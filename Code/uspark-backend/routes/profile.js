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
 *   - name: Dashboard
 *     description: Endpoints for fetching user dashboard data and doctor verification
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard profile data
 *     tags: [Dashboard]
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

// Save availability
router.post("/doctor/availability", authenticate, async (req, res) => {
    try {
        const { slots } = req.body;

        const doctor = await Doctor.findOne({ userId: req.user.userId });
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        doctor.availability = slots;
        await doctor.save();

        res.status(200).json({ message: "Availability saved successfully", availability: doctor.availability });
    } catch (err) {
        console.error("Error saving availability:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get availability
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

// PUT /api/profile/doctor/availability
// PUT /api/profile/doctor/availability/:id
router.put("/doctor/availability/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, startTime, endTime, slotDuration } = req.body;

        const doctor = await Doctor.findOne({ userId: req.user.userId });
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        const slot = doctor.availability.id(id);
        if (!slot) return res.status(404).json({ message: "Slot not found" });

        // Update fields
        slot.date = date;
        slot.startTime = startTime;
        slot.endTime = endTime;
        slot.slotDuration = slotDuration;

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


router.get("/signed-url", authenticate, async (req, res) => {
    const { key } = req.query;
    const signedUrl = await getS3SignedUrl(key, AWS_BUCKET_RUSH_HOUR_UPLOADS); // your S3 util function
    res.json({ url: signedUrl });
});

module.exports = router;