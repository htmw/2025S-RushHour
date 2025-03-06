const express = require("express");
const Insurance = require("../Models/Insurance");
const User = require("../Models/User");
const router = express.Router();
const { default: authenticate } = require("../Middleware/authenticate");

router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user)
      return res.status(200).json({ message: "User not found", error: true });

    if (user.role !== "patient") {
      return res.status(200).json({
        message: "Only patients can have insurance details",
        error: true,
      });
    }

    const insurance = await Insurance.findOne({ userId: user._id });
    if (!insurance) {
      return res
        .status(200)
        .json({ message: "No insurance details found", error: true });
    }

    res.json(insurance);
  } catch (error) {
    console.error("Error fetching insurance details:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure only patients can save insurance details
    if (user.role !== "patient") {
      return res
        .status(403)
        .json({ message: "Only patients can update insurance details" });
    }

    const { providerName, startDate, endDate, holderName } = req.body;

    // Check if insurance details already exist
    let insurance = await Insurance.findOne({ userId: user._id });

    if (insurance) {
      // Update existing insurance details
      insurance.providerName = providerName;
      insurance.startDate = startDate;
      insurance.endDate = endDate;
      insurance.holderName = holderName;
    } else {
      // Create new insurance record
      insurance = new Insurance({
        userId: user._id,
        providerName,
        startDate,
        endDate,
        holderName,
      });
    }

    await insurance.save();
    res
      .status(201)
      .json({ message: "Insurance details saved successfully!", insurance });
  } catch (error) {
    console.error("Error saving insurance details:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
