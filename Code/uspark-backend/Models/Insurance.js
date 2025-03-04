const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // Link to User
  providerName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  holderName: { type: String, required: true },
});

module.exports = mongoose.model("Insurance", insuranceSchema);
