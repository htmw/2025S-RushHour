const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    healthIssue: { type: String, required: true },
    dateOfOccurrence: { type: Date, required: true },
    status: { type: String, enum: ["ongoing", "resolved"], required: true },
    treatmentGiven: { type: String, required: true },

    // Optional fields
    diagnosedBy: { type: String },
    diagnosedAt: { type: String },
    insuranceUsed: { type: String },
    prescriptionDetails: { type: String },
    notes: { type: String },
    followUpDate: { type: Date },
    attachments: [{ type: String }], // S3 URLs for original attachments
    segmentedAttachments: [{ type: String }], // S3 URLs for segmented images
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalHistory", medicalHistorySchema);
