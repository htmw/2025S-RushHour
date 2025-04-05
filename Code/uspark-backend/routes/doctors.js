const express = require("express");
const router = express.Router();
const Doctor = require("../Models/onBoarding/Doctor");
const { default: authenticate } = require("../Middleware/authenticate");
const Appointment = require("../Models/Appointment");
const User = require("../Models/User");
const Patient = require("../Models/onBoarding/Patient");
const Insurance = require("../Models/Insurance");
const MedicalHistory = require("../Models/MedicalHistory");

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
