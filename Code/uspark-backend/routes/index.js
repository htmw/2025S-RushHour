const express = require("express");

const onBoardingRoutes = require("./onboarding");
const dashboardRoutes = require("./dashboard");
const profileImageRoutes = require("./profileimage");
const insuranceRoutes = require("./Insurances");
const adminRoutes = require("./admin");
const hospitalsRoutes = require("./hospitals");
const appointmentRoutes = require("./appointments");
const MedicalHistory = require("./medicalHistory");
const profileRoutes = require("./profile");
const doctorRoutes = require("./doctors");
const chatHistory = require("./chatHistory");
const assessmentsRoutes = require("./assessments");
const medsegRoutes = require("./medseg");
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
router.use("/profile-image", profileImageRoutes);
router.use("/insurance", insuranceRoutes);
router.use("/admin", adminRoutes);
router.use("/profile", profileRoutes);
router.use("/hospitals", hospitalsRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/medical-history", MedicalHistory);
router.use("/doctors", doctorRoutes);
router.use("/chathistory", chatHistory);
router.use("/assessments", assessmentsRoutes);
router.use("/medseg", medsegRoutes);

module.exports = router;
