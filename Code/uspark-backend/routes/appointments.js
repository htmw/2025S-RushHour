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
 *     description: Endpoints for booking hospital appointments
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

module.exports = router;
