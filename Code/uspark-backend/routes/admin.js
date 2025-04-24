const express = require("express");
const Doctor = require("../Models/onBoarding/Doctor");
const { sendEmail } = require("../utils/emailService");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin-related endpoints for managing doctor verification
 */

/**
 * @swagger
 * /api/admin/verify-doctor/{id}:
 *   post:
 *     summary: Approve or reject doctor verification
 *     tags: [Admin]
 *     description: Allows an admin to approve or reject a doctor's verification request.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor's unique ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               decision:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 example: "approved"
 *     responses:
 *       200:
 *         description: Verification decision applied successfully
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal Server Error
 */
router.post("/verify-doctor/:id", async (req, res) => {
  const { decision } = req.body; // "approved" or "rejected"

  try {
    const doctor = await Doctor.findById(req.params.id).populate("userId");

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    //  Update verification status
    doctor.verificationStatus = decision;
    await doctor.save();

    //  Send Email to Doctor
    const doctorMessage = `
      <h2>Doctor Verification Update</h2>
      <p>Your verification request has been <strong>${decision}</strong>.</p>
      ${
        decision === "approved"
          ? "<p>You can now access all platform features.</p>"
          : "<p>Please re-upload valid documents for verification.</p>"
      }
    `;

    sendEmail(doctor.userId.email, "Verification Status Update", doctorMessage);

    res.json({ message: `Doctor verification ${decision}` });
  } catch (error) {
    console.error("Admin Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/admin/doctors:
 *   get:
 *     summary: Get list of all doctors
 *     tags: [Admin]
 *     description: Fetches a list of all doctors and their verification status.
 *     responses:
 *       200:
 *         description: List of doctors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "65f4c3bdf1a3d7a9e9a4d8c2"
 *                   userId:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: "doctor@example.com"
 *                       fullName:
 *                         type: string
 *                         example: "Dr. John Doe"
 *                   specialization:
 *                     type: string
 *                     example: "Cardiology"
 *                   verificationStatus:
 *                     type: string
 *                     enum: [pending, approved, rejected]
 *                     example: "approved"
 *       500:
 *         description: Internal Server Error
 */
router.get("/doctors", async (req, res) => {
  try {
    console.log({res,req})
    const doctors = await Doctor.find({}).populate("userId");
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
