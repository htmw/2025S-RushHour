const express = require("express");
const Doctor = require("../Models/Doctor");
const { sendEmail } = require("../utils/emailService");

const router = express.Router();

//  Admin Approves or Rejects Doctor Verification
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
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId");
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
