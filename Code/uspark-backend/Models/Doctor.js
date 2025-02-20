const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true }, // Years of experience
    certifications: { type: String }, // Can be expanded to array if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DoctorSchema);
