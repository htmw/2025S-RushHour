const express = require("express");

const onBoardingRoutes = require("./onboarding");
const dashboardRoutes = require("./dashboard");
const profileImageRoutes = require("./profileimage");
const insuranceRoutes = require("./Insuranceroutes");
const adminRoutes = require("./admin");
const chatRoutes = require("./chat");

const router = express.Router();

// Register Routes
router.use("/onboarding", onBoardingRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/upload-profile-image", profileImageRoutes);
router.use("/insurance", insuranceRoutes);
router.use("/admin", adminRoutes);
router.use("/chat", chatRoutes);

module.exports = router;
