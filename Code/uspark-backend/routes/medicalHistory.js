/**
 * @swagger
 * tags:
 *   - name: MedicalHistory
 *     description: Endpoints for managing patient medical history
 */

const express = require("express");
const router = express.Router();
const authenticate = require("../Middleware/authenticate").default;
const { AWS_BUCKET_RUSH_HOUR_UPLOADS, FRONTEND_URL } = require("../config.js");
const { getS3SignedUrl } = require("../Middleware/s3.js");
const upload = require("../Middleware/upload")(
    "medical-history",
    AWS_BUCKET_RUSH_HOUR_UPLOADS
);
const MedicalHistory = require("../Models/MedicalHistory");


/**
 * @swagger
 * /api/medical-history:
 *   post:
 *     summary: Save medical history
 *     tags: [MedicalHistory]
 *     description: Save a new medical history record for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               healthIssue:
 *                 type: string
 *                 example: "Asthma"
 *               dateOfOccurrence:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-01"
 *               status:
 *                 type: string
 *                 example: "Ongoing"
 *               treatmentGiven:
 *                 type: string
 *                 example: "Inhaler and steroids"
 *               notes:
 *                 type: string
 *                 example: "Patient responds well to medication"
 *     responses:
 *       201:
 *         description: Medical history saved
 *       500:
 *         description: Server Error
 */
router.post("/", authenticate, async (req, res) => {
    try {
        const { healthIssue, dateOfOccurrence, status, treatmentGiven, ...optionalFields } = req.body;

        const history = new MedicalHistory({
            userId: req.user.userId,
            healthIssue,
            dateOfOccurrence,
            status,
            treatmentGiven,
            ...optionalFields
        });

        await history.save();
        res.status(201).json({ message: "Medical history saved", history });
    } catch (err) {
        console.error("Error saving medical history:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

/**
 * @swagger
 * /api/medical-history/upload:
 *   post:
 *     summary: Upload medical report
 *     tags: [MedicalHistory]
 *     description: Upload an attachment file for medical history (PDF, image, etc.)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               medicalReport:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 fileUrl:
 *                   type: string
 *                   example: "https://bucket.s3.amazonaws.com/medical-history/..."
 *       400:
 *         description: No file uploaded
 */
router.post(
    "/upload",
    authenticate,
    upload.single("medicalReport"),
    async (req, res) => {
        if (!req.file) return res.status(400).json({ message: "No file uploaded." });

        res.status(200).json({
            message: "File uploaded successfully",
            fileUrl: req.file.location,
        });
    }
);

/**
 * @swagger
 * /api/medical-history/upload:
 *   post:
 *     summary: Upload medical report
 *     tags: [MedicalHistory]
 *     description: Upload an attachment file for medical history (PDF, image, etc.)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               medicalReport:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 fileUrl:
 *                   type: string
 *                   example: "https://bucket.s3.amazonaws.com/medical-history/..."
 *       400:
 *         description: No file uploaded
 */
router.get("/signed-url", authenticate, async (req, res) => {
    const { key } = req.query;
    const signedUrl = await getS3SignedUrl(key, AWS_BUCKET_RUSH_HOUR_UPLOADS); // your S3 util function
    res.json({ url: signedUrl });
});

/**
 * @swagger
 * /api/medical-history:
 *   get:
 *     summary: Get all medical history entries
 *     tags: [MedicalHistory]
 *     description: Retrieve all medical history records for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of medical history records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   healthIssue:
 *                     type: string
 *                   dateOfOccurrence:
 *                     type: string
 *                     format: date
 *                   status:
 *                     type: string
 *                   treatmentGiven:
 *                     type: string
 *                   notes:
 *                     type: string
 *       500:
 *         description: Server Error
 */
router.get("/", authenticate, async (req, res) => {
    try {
        console.log({ userId: req.user.userId });

        const histories = await MedicalHistory.find({ userId: req.user.userId })
            .sort({ dateOfOccurrence: -1 });
        console.log({ histories });

        res.status(200).json(histories);
    } catch (err) {
        console.error("Error fetching medical history:", err);
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;
