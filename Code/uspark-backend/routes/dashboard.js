const express = require("express");
const User = require("../Models/User");
const Patient = require("../Models/onBoarding/Patient");
const { default: authenticate } = require("../Middleware/authenticate");
const { FRONTEND_URL } = require("../config.js");
const Insurance = require("../Models/Insurance");
const MedicalHistory = require("../Models/MedicalHistory.js");
const QRCode = require("qrcode")
const router = express.Router();
const Doctor = require("../Models/onBoarding/Doctor"); // <-- Make sure this is imported

router.get("/all", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const qrData = `${FRONTEND_URL}/${user.role}/${user._id}`;
    const qrCodeBase64 = await QRCode.toDataURL(qrData);

    let data = {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImage: user.image || "",
      qrCode: qrCodeBase64,
    };

    if (user.role === "patient") {
      const [patient, insurance, medicalHistory] = await Promise.all([
        Patient.findOne({ userId: user._id }),
        Insurance.findOne({ userId: user._id }),
        MedicalHistory.find({ userId: user._id }).sort({ dateOfOccurrence: -1 }),
      ]);

      data = {
        ...data,
        patientDetails: patient || {},
        insuranceDetails: insurance || {},
        medicalHistory: medicalHistory || [],
      };
    } else if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: user._id });

      data = {
        ...data,
        doctorDetails: doctor || {},
      };
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching full dashboard data:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
