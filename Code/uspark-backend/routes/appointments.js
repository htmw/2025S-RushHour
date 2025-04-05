require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const { sendEmail } = require("../utils/emailService"); // or wherever your utils is
const Doctor = require("../Models/onBoarding/Doctor");
const Appointment = require("../Models/Appointment");
const { default: authenticate } = require("../Middleware/authenticate");

router.use(cors());





// API to book an appointment

router.post("/", authenticate, async (req, res) => {
  try {
    const { doctorId, date, startTime, reason } = req.body;
    const user = req.user;

    if (!doctorId || !user.fullName || !user.email || !date || !startTime || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const doctor = await Doctor.findById(doctorId).populate("userId");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Prevent double booking
    const existing = await Appointment.findOne({ doctor: doctorId, date, startTime });
    if (existing) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    const newAppointment = new Appointment({
      doctor: doctorId,
      userId: user.userId,
      name: user.fullName,
      email: user.email,
      date,
      startTime,
      reason,
      bookingDate: new Date().toISOString().slice(0, 10), // 👈 today's booking date

    });

    await newAppointment.save();

    // Send emails...
    await sendEmail(doctor.userId.email, "New Appointment Scheduled", "appointmentDoctor", {
      doctorName: doctor.userId.fullName,
      patientName: user.fullName,
      patientEmail: user.email,
      date,
      startTime,
      reason,
    });

    await sendEmail(user.email, "Appointment Confirmation", "appointmentPatient", {
      doctorName: doctor.userId.fullName,
      patientName: user.fullName,
      date,
      startTime,
      reason,
      hospitalName: doctor.hospitalName,
      hospitalAddress: doctor.hospitalAddress,
    });

    res.status(201).json({ message: "Appointment booked and emails sent." });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Failed to book appointment." });
  }
});



// API to fetch all appointments
router.get("/", authenticate, async (req, res) => {
  try {
    const user = req.user;

    let query = {};
    if (user.role === "patient") {
      query.email = user.email;
    } else if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: user.userId });
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
      query.doctor = doctor._id;
    }

    const appointments = await Appointment.find(query)
      .populate("doctor", "hospitalName hospitalAddress")
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
});


// API to reschedule an appointment
router.put("/:id", authenticate, async (req, res) => {
  try {
    const user = req.user;
    const { date, startTime, reason } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Only allow if patient is the owner
    if (user.role === "patient" && appointment.email !== user.email) {
      return res.status(403).json({ message: "Unauthorized to update this appointment." });
    }

    // Update the fields
    appointment.date = date || appointment.date;
    appointment.startTime = startTime || appointment.startTime;
    appointment.reason = reason || appointment.reason;

    await appointment.save();

    // Populate doctor info
    const updatedAppointment = await Appointment.findById(appointment._id).populate({
      path: "doctor",
      populate: { path: "userId", select: "email fullName" },
    });

    const doctorUser = updatedAppointment.doctor.userId;

    // Send updated confirmation emails
    await sendEmail(doctorUser.email, "Appointment Rescheduled", "appointmentDoctor", {
      doctorName: doctorUser.fullName,
      patientName: appointment.name,
      patientEmail: appointment.email,
      date: appointment.date,
      startTime: appointment.startTime,
      reason: appointment.reason,
    });

    await sendEmail(appointment.email, "Your Appointment Has Been Rescheduled", "appointmentPatient", {
      doctorName: doctorUser.fullName,
      patientName: appointment.name,
      date: appointment.date,
      startTime: appointment.startTime,
      reason: appointment.reason,
      hospitalName: updatedAppointment.doctor.hospitalName,
      hospitalAddress: updatedAppointment.doctor.hospitalAddress,
    });

    res.status(200).json({
      message: "Appointment rescheduled and emails sent successfully.",
      updatedAppointment,
    });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ error: "Failed to reschedule appointment." });
  }
});



// API to delete an appointment
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const user = req.user;

    const appointment = await Appointment.findById(req.params.id).populate({
      path: "doctor",
      populate: { path: "userId", select: "email fullName" },
    });

    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    // Only allow deletion by the patient who booked it or doctor
    if (user.role === "patient" && appointment.email !== user.email) {
      return res.status(403).json({ message: "Unauthorized to delete this appointment." });
    }

    const doctorUser = appointment.doctor.userId;

    // Send cancellation emails
    await sendEmail(doctorUser.email, "Appointment Cancelled", "appointmentCancelledDoctor", {
      doctorName: doctorUser.fullName,
      patientName: appointment.name,
      date: appointment.date,
      startTime: appointment.startTime,
      reason: appointment.reason,
    });

    await sendEmail(appointment.email, "Your Appointment Has Been Cancelled", "appointmentCancelledPatient", {
      doctorName: doctorUser.fullName,
      date: appointment.date,
      startTime: appointment.startTime,
      reason: appointment.reason,
      hospitalName: appointment.doctor.hospitalName,
      hospitalAddress: appointment.doctor.hospitalAddress,
    });

    await appointment.deleteOne();

    res.status(200).json({ message: "Appointment deleted and emails sent successfully." });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment." });
  }
});


module.exports = router;
