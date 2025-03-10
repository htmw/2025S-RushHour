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
    experience: { type: Number, required: true },
    certifications: { type: String },
    verificationStatus: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
    verificationDocs: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DoctorSchema);
