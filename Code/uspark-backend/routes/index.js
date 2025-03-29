const express = require("express");

const onBoardingRoutes = require("./onboarding");
const dashboardRoutes = require("./dashboard");
const profileImageRoutes = require("./profileimage");
const insuranceRoutes = require("./Insuranceroutes");
const adminRoutes = require("./admin");
const chatRoutes = require("./chat");
const hospitalsRoutes = require("./hospitals")
const appointmentRoutes = require("./appointments");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Onboarding
 *     description: User onboarding endpoints
 *   - name: Dashboard
 *     description: Dashboard-related endpoints
 *   - name: Profile Image
 *     description: Profile image upload endpoints
 *   - name: Insurance
 *     description: Insurance-related API endpoints
 *   - name: Admin
 *     description: Admin panel functionalities
 *   - name: Chat
 *     description: Chat and messaging endpoints
 */

// Register Routes
router.use("/onboarding", onBoardingRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/upload-profile-image", profileImageRoutes);
router.use("/insurance", insuranceRoutes);
router.use("/admin", adminRoutes);
router.use("/chat", chatRoutes);
router.use("/hospitals", hospitalsRoutes);
router.use("/appointments",appointmentRoutes); 

module.exports = router;
