const mongoose = require("mongoose");

const AvailabilitySlotSchema = new mongoose.Schema({
  date: { type: String }, // "YYYY-MM-DD"
  startTime: { type: String }, // "HH:mm"
  endTime: { type: String },
  slotDuration: { type: Number },
  mode: {
    type: String,
    enum: ['in-person', 'virtual', 'both'],
    default: 'both',
  },
});


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
    hospitalName: { type: String },
    hospitalAddress: { type: String },

    availability: [AvailabilitySlotSchema], // 👈 Add this line
  },
  { timestamps: true }
);


module.exports = mongoose.model("Doctor", DoctorSchema);
