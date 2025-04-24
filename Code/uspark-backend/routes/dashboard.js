/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Dashboard view with full user data including QR code, profile, and related info
 */

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

/**
 * @swagger
 * /api/dashboard/all:
 *   get:
 *     summary: Get full dashboard data
 *     tags: [Dashboard]
 *     description: |
 *       Returns comprehensive profile information for the authenticated user along with a QR code.
 *       If the user is a patient, insurance details and medical history are also included.
 *       If the user is a doctor, doctor-specific details are included.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Full dashboard data retrieved successfully
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
 *                   example: "john@example.com"
 *                 role:
 *                   type: string
 *                   enum: [patient, doctor]
 *                   example: "patient"
 *                 profileImage:
 *                   type: string
 *                   example: "https://example.com/uploads/profile.png"
 *                 qrCode:
 *                   type: string
 *                   format: base64
 *                   description: QR Code image as a base64 string
 *                 patientDetails:
 *                   type: object
 *                   description: Patient-specific profile data
 *                 insuranceDetails:
 *                   type: object
 *                   description: Patient insurance information
 *                 medicalHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: List of medical history records
 *                 doctorDetails:
 *                   type: object
 *                   description: Doctor-specific profile data (if user is a doctor)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */
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
