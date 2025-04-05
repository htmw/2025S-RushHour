const mongoose = require("mongoose");
// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ new
    name: { type: String, required: true },  // Display name (cached from user)
    email: { type: String, required: true }, // Email (cached from user)
    date: { type: String, required: true },  // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    reason: { type: String, required: true },
    bookingDate: { type: String, required: true },  // 👈 New field (YYYY-MM-DD)

});


module.exports = mongoose.model("Appointment", appointmentSchema);
