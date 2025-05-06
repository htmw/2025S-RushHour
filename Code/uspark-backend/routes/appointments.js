/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Endpoints for booking, viewing, updating, and deleting appointments
 */

require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const { sendEmail } = require("../utils/emailService"); // or wherever your utils is
const Doctor = require("../Models/onBoarding/Doctor");
const Appointment = require("../Models/Appointment");
const { default: authenticate } = require("../Middleware/authenticate");
const User = require("../Models/User"); // adjust path if needed
const {
  scheduleGoogleMeet,
  scheduleZoomMeeting,
} = require("../utils/meetingService"); // Utility for scheduling meetings

router.use(cors());

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book an appointment
 *     tags: [Appointments]
 *     description: Book a new appointment with a doctor
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "65f4c3bdf1a3d7a9e9a4d8c2"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-09"
 *               startTime:
 *                 type: string
 *                 example: "10:30"
 *               reason:
 *                 type: string
 *                 example: "Routine Checkup"
 *     responses:
 *       201:
 *         description: Appointment booked and confirmation emails sent
 *       400:
 *         description: Missing fields or time slot already booked
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Failed to book appointment
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const { doctorId, date, startTime, reason, platform } = req.body; // Include platform in the request
    const user = req.user;

    if (
      !doctorId ||
      !user.fullName ||
      !user.email ||
      !date ||
      !startTime ||
      !reason
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const doctor = await Doctor.findById(doctorId).populate("userId");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Prevent double booking
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      startTime,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked." });
    }

    let meetingLink = await scheduleGoogleMeet({
      date,
      startTime,
      patientName: user.fullName,
      doctorName: doctor.userId.fullName,
      patientEmail: user.email,
      doctorEmail: doctor.userId.email,
    });

    const newAppointment = new Appointment({
      doctor: doctorId,
      userId: user.userId,
      name: user.fullName,
      email: user.email,
      date,
      startTime,
      reason,
      platform,
      meetingLink, // Save the meeting link for virtual appointments
      bookingDate: new Date().toISOString().slice(0, 10),
    });

    await newAppointment.save();

    // Send emails...
    await sendEmail(
      doctor.userId.email,
      "New Appointment Scheduled",
      "appointmentDoctor",
      {
        doctorName: doctor.userId.fullName,
        patientName: user.fullName,
        patientEmail: user.email,
        date,
        startTime,
        reason,
        platform,
        meetingLink,
      }
    );

    await sendEmail(
      user.email,
      "Appointment Confirmation",
      "appointmentPatient",
      {
        doctorName: doctor.userId.fullName,
        patientName: user.fullName,
        date,
        startTime,
        reason,
        platform,
        meetingLink,
        hospitalName: doctor.hospitalName,
        hospitalAddress: doctor.hospitalAddress,
      }
    );

    res.status(201).json({ message: "Appointment booked and emails sent." });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Failed to book appointment." });
  }
});
/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get appointments for current user
 *     tags: [Appointments]
 *     description: Returns all appointments for the authenticated patient or doctor
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       403:
 *         description: Unauthorized role
 *       404:
 *         description: User or doctor not found
 *       500:
 *         description: Failed to fetch appointments
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const { email, userId } = req.user;
    // Fetch the user with role from the DB
    const dbUser = await User.findOne({ email });
    if (!dbUser) return res.status(404).json({ message: "User not found" });

    let query = {};
    if (dbUser.role === "patient") {
      query.userId = userId;
    } else if (dbUser.role === "doctor") {
      const doctor = await Doctor.findOne({ userId: userId });
      console.log({ doctor });
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
      query.doctor = doctor._id;
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
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

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Reschedule an appointment
 *     tags: [Appointments]
 *     description: Update an existing appointment (only allowed by the patient who booked it)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-15"
 *               startTime:
 *                 type: string
 *                 example: "14:00"
 *               reason:
 *                 type: string
 *                 example: "Follow-up"
 *     responses:
 *       200:
 *         description: Appointment rescheduled and emails sent
 *       403:
 *         description: Unauthorized to update
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Failed to reschedule appointment
 */
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
      return res
        .status(403)
        .json({ message: "Unauthorized to update this appointment." });
    }

    // Update the fields
    appointment.date = date || appointment.date;
    appointment.startTime = startTime || appointment.startTime;
    appointment.reason = reason || appointment.reason;

    await appointment.save();

    // Populate doctor info
    const updatedAppointment = await Appointment.findById(
      appointment._id
    ).populate({
      path: "doctor",
      populate: { path: "userId", select: "email fullName" },
    });

    const doctorUser = updatedAppointment.doctor.userId;

    let meetingLink = await scheduleGoogleMeet({
      date,
      startTime,
      patientName: user.fullName,
      doctorName: doctorUser.fullName,
      patientEmail: user.email,
      doctorEmail: doctorUser.email,
    });
    // Send updated confirmation emails
    await sendEmail(
      doctorUser.email,
      "Appointment Rescheduled",
      "appointmentDoctor",
      {
        doctorName: doctorUser.fullName,
        patientName: appointment.name,
        patientEmail: appointment.email,
        date: appointment.date,
        startTime: appointment.startTime,
        reason: appointment.reason,
        meetingLink,
      }
    );

    await sendEmail(
      appointment.email,
      "Your Appointment Has Been Rescheduled",
      "appointmentPatient",
      {
        doctorName: doctorUser.fullName,
        patientName: appointment.name,
        date: appointment.date,
        startTime: appointment.startTime,
        reason: appointment.reason,
        hospitalName: updatedAppointment.doctor.hospitalName,
        hospitalAddress: updatedAppointment.doctor.hospitalAddress,
        meetingLink,
      }
    );

    res.status(200).json({
      message: "Appointment rescheduled and emails sent successfully.",
      updatedAppointment,
    });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ error: "Failed to reschedule appointment." });
  }
});

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Cancel an appointment
 *     tags: [Appointments]
 *     description: Deletes an appointment. Only the patient who booked or the doctor can delete.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment cancelled and emails sent
 *       403:
 *         description: Unauthorized to delete
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Failed to delete appointment
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const user = req.user;

    const appointment = await Appointment.findById(req.params.id).populate({
      path: "doctor",
      populate: { path: "userId", select: "email fullName" },
    });

    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });

    // Only allow deletion by the patient who booked it or doctor
    if (user.role === "patient" && appointment.email !== user.email) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this appointment." });
    }

    const doctorUser = appointment.doctor.userId;

    // Send cancellation emails
    await sendEmail(
      doctorUser.email,
      "Appointment Cancelled",
      "appointmentCancelledDoctor",
      {
        doctorName: doctorUser.fullName,
        patientName: appointment.name,
        date: appointment.date,
        startTime: appointment.startTime,
        reason: appointment.reason,
      }
    );

    await sendEmail(
      appointment.email,
      "Your Appointment Has Been Cancelled",
      "appointmentCancelledPatient",
      {
        doctorName: doctorUser.fullName,
        date: appointment.date,
        startTime: appointment.startTime,
        reason: appointment.reason,
        hospitalName: appointment.doctor.hospitalName,
        hospitalAddress: appointment.doctor.hospitalAddress,
      }
    );

    await appointment.deleteOne();

    res
      .status(200)
      .json({ message: "Appointment deleted and emails sent successfully." });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment." });
  }
});

module.exports = router;
