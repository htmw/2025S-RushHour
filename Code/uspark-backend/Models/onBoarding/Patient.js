const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    age: { type: Number, required: true },
    sex: { type: String, enum: ["male", "female"], required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    healthIssues: { type: [String], default: [] }, // Changed from String to Array of Strings
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);
