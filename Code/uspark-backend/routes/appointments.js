require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const mongoose = require("mongoose");

router.use(cors()); // Enable CORS for frontend requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  reason: { type: String, required: true },
  hospitalName: { type: String, required: true },
  hospitalAddress: { type: String, required: true },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Endpoints for booking, managing, and deleting hospital appointments
 */

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Book an appointment
 *     description: Creates a new hospital appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *               - reason
 *               - hospitalName
 *               - hospitalAddress
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               date:
 *                 type: string
 *                 example: "2025-04-01"
 *               reason:
 *                 type: string
 *                 example: "General Checkup"
 *               hospitalName:
 *                 type: string
 *                 example: "ABC Hospital"
 *               hospitalAddress:
 *                 type: string
 *                 example: "123 Main St, New York"
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       500:
 *         description: Failed to book appointment
 */
router.post("/", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully." });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment." });
  }
});

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get all appointments
 *     description: Retrieves a list of all booked appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of appointments retrieved successfully
 *       500:
 *         description: Failed to retrieve appointments
 */
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to retrieve appointments." });
  }
});

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Reschedule an appointment
 *     description: Updates the date of an existing appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the appointment to reschedule
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2025-05-01"
 *     responses:
 *       200:
 *         description: Appointment rescheduled successfully
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Failed to reschedule appointment
 */
router.put("/:id", async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res
        .status(400)
        .json({ error: "New date is required for rescheduling." });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res
      .status(200)
      .json({
        message: "Appointment rescheduled successfully",
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
 *     description: Deletes an existing appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the appointment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment canceled successfully
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Failed to cancel appointment
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res.status(200).json({ message: "Appointment canceled successfully." });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ error: "Failed to cancel appointment." });
  }
});

module.exports = router;
