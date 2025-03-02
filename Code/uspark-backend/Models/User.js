const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: {
      type: String,
      enum: ["local", "google.com", "apple.com"],
      default: "local",
    },
    role: { type: String, enum: ["patient", "doctor"], required: false },
    isOnboarded: { type: Boolean, default: false },
    image: { type: String }, // Stores the image URL or file path
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
