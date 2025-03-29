require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

router.use(cors());

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
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
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Confirmation Email
const sendConfirmationEmail = async (appointment) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: appointment.email,
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

// API to fetch all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
});

// API to reschedule an appointment
router.put("/:id", async (req, res) => {
  try {
    const { date, reason } = req.body;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date, reason },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res
      .status(200)
      .json({
        message: "Appointment rescheduled successfully.",
        updatedAppointment,
      });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ error: "Failed to reschedule appointment." });
  }
});

// API to delete an appointment
router.delete("/:id", async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully." });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment." });
  }
});

module.exports = router;
