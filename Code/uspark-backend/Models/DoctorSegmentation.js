const mongoose = require("mongoose");

const DoctorSegmentationSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  originalImage: { type: String, required: true },
  segmentedImage: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DoctorSegmentation", DoctorSegmentationSchema);
