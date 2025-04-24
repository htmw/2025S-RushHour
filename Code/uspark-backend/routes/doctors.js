/**
 * @swagger
 * tags:
 *   - name: Doctors
 *     description: Endpoints for retrieving doctor and patient information
 */

const express = require("express");
const router = express.Router();
const Doctor = require("../Models/onBoarding/Doctor");
const { default: authenticate } = require("../Middleware/authenticate");
const Appointment = require("../Models/Appointment");
const User = require("../Models/User");
const Patient = require("../Models/onBoarding/Patient");
const Insurance = require("../Models/Insurance");
const MedicalHistory = require("../Models/MedicalHistory");

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors with availability
 *     tags: [Doctors]
 *     description: Retrieve a list of all doctors who have availability set
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctors with availability
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "65f7d9b89b3c4f1a1f4c3b1e"
 *                   fullName:
 *                     type: string
 *                     example: "Dr. John Smith"
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   specialization:
 *                     type: string
 *                     example: "Cardiology"
 *                   experience:
 *                     type: number
 *                     example: 10
 *                   hospitalName:
 *                     type: string
 *                     example: "Saint Luke's Hospital"
 *                   hospitalAddress:
 *                     type: string
 *                     example: "123 Main St, St. Louis, MO"
 *                   availability:
 *                     type: array
 *                     items:
 *                       type: object
 *       500:
 *         description: Failed to fetch doctors
 */
router.get("/", authenticate, async (req, res) => {
    try {
        const doctors = await Doctor.find({
            availability: { $exists: true, $ne: [] }, // ✅ only if availability is set and not empty
        }).populate("userId");

        const formattedDoctors = doctors.map((doc) => ({
            _id: doc._id,
            fullName: doc.userId.fullName,
            email: doc.userId.email,
            specialization: doc.specialization,
            experience: doc.experience,
            hospitalName: doc.hospitalName,
            hospitalAddress: doc.hospitalAddress,
            availability: doc.availability,
        }));

        res.status(200).json(formattedDoctors);
    } catch (err) {
        console.error("Error fetching doctors:", err);
        res.status(500).json({ error: "Failed to fetch doctors" });
    }
});


/**
 * @swagger
 * /api/doctors/patients:
 *   get:
 *     summary: Get patients of the authenticated doctor
 *     tags: [Doctors]
 *     description: Retrieve a list of patients who have booked appointments with the logged-in doctor
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of patient users with basic profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   fullName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   patientProfile:
 *                     type: object
 *                     description: Profile info from Patient collection
 *       403:
 *         description: Only doctors can access this route
 *       500:
 *         description: Server error
 */
router.get("/patients", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // ✅ Fetch full user
        if (!user || user.role !== "doctor")
            return res.status(403).json({ message: "Only doctors can access this." });

        const doctor = await Doctor.findOne({ userId: user._id });
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        const appointments = await Appointment.find({ doctor: doctor._id });

        const patientUserIds = [...new Set(appointments.map((a) => a.userId.toString()))];

        const users = await User.find({ _id: { $in: patientUserIds } }).select("-password");
        const patients = await Patient.find({ userId: { $in: users.map((u) => u._id) } });

        const enriched = users.map((user) => {
            const profile = patients.find((p) => p.userId.toString() === user._id.toString());
            return {
                ...user.toObject(),
                patientProfile: profile || null,
            };
        });

        res.status(200).json(enriched);
    } catch (err) {
        console.error("GET /patients error", err);
        res.status(500).json({ message: "Server error." });
    }
});


/**
 * @swagger
 * /api/doctors/patient/{id}:
 *   get:
 *     summary: Get full patient details
 *     tags: [Doctors]
 *     description: Retrieve full details (profile, insurance, medical history, appointments) of a patient
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the patient
 *     responses:
 *       200:
 *         description: Patient full information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 profile:
 *                   type: object
 *                 insurance:
 *                   type: object
 *                 medicalHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Only doctors can access this route
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */
router.get("/patient/:id", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // ✅ Same fix here
        if (!user || user.role !== "doctor")
            return res.status(403).json({ message: "Only doctors can access this." });

        const patientId = req.params.id;
        const userDetails = await User.findById(patientId).select("-password");
        if (!userDetails) return res.status(404).json({ message: "Patient not found" });

        const [patientProfile, insurance, medicalHistory, appointments] = await Promise.all([
            Patient.findOne({ userId: patientId }),
            Insurance.findOne({ userId: patientId }),
            MedicalHistory.find({ userId: patientId }),
            Appointment.find({ userId: patientId }).sort({ date: 1 }),
        ]);

        res.status(200).json({
            user: userDetails,
            profile: patientProfile,
            insurance,
            medicalHistory,
            appointments,
        });
    } catch (err) {
        console.error("GET /patient/:id error", err);
        res.status(500).json({ message: "Failed to fetch patient data" });
    }
});

module.exports = router;
