require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer"); // Import Nodemailer

router.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // Add email field
  date: { type: String, required: true },
  reason: { type: String, required: true },
  hospitalName: { type: String, required: true },
  hospitalAddress: { type: String, required: true },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Send Confirmation Email
const sendConfirmationEmail = async (appointment) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: appointment.email, // Send email to the user
    subject: "Appointment Confirmation",
    text: `Hello ${appointment.name},\n\nYour appointment has been successfully booked at ${appointment.hospitalName} on ${appointment.date}.\n\nReason: ${appointment.reason}\n\nHospital Address: ${appointment.hospitalAddress}\n\nThank you for choosing our service!\n\nBest regards,\nYour Healthcare Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent to:", appointment.email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// API to book an appointment
router.post("/", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    // Send confirmation email
    await sendConfirmationEmail(req.body);

    res.status(201).json({ message: "Appointment booked successfully." });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment." });
  }
});

module.exports = router;
