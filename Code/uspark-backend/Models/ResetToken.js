const mongoose = require("mongoose");

const resetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 }, // Expire after 15 mins
});

module.exports = mongoose.model("ResetToken", resetTokenSchema);
