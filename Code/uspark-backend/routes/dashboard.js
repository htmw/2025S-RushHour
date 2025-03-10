const express = require("express");
const User = require("../Models/User");
const Patient = require("../Models/Patient");
const Doctor = require("../Models/Doctor");
const { default: authenticate } = require("../Middleware/authenticate");
const { sendEmail, ADMIN_EMAIL } = require("../utils/emailService");
const upload = require("../Middleware/upload"); // Ensure this exists
const { ADMIN_PANEL_URL } = require("../utils/emailService");

const router = express.Router();

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
 *       500:
 *         description: Server error.
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
 * /api/dashboard/doctor/verify:
 *   post:
 *     summary: Upload verification documents for doctor approval
 *     tags: [Dashboard]
 *     description: Allows doctors to upload verification documents for approval.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 example: ["file1.pdf", "file2.jpg"]
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *       500:
 *         description: Internal server error
 */

router.post(
  "/doctor/verify",
  authenticate,
  upload.array("documents", 5),
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.user.userId });
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });

      // Save uploaded document URLs
      doctor.verificationDocs = req.files.map((file) => file.location);
      doctor.verificationStatus = "pending"; // Set status to pending
      await doctor.save();

      //  Send Email to Admin
      const adminMessage = `
      <h2>New Doctor Verification Request</h2>
      <p>A doctor has submitted verification documents.</p>
      <p><strong>Doctor ID:</strong> ${doctor._id}</p>
      <p><strong>Specialization:</strong> ${doctor.specialization}</p>
      <p>Click below to review:</p>
      <a href="${ADMIN_PANEL_URL}">Go to Admin Portal</a>
    `;

      sendEmail(ADMIN_EMAIL, "Doctor Verification Request", adminMessage);

      res
        .status(201)
        .json({ message: "Verification request submitted successfully." });
    } catch (error) {
      console.error("Verification Upload Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
