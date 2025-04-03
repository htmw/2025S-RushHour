const express = require("express");
const router = express.Router();
const authenticate = require("../Middleware/authenticate").default;
const MedicalHistory = require("../Models/MedicalHistory");
const { AWS_BUCKET_RUSH_HOUR_UPLOADS } = require("../config.js");
const { getS3SignedUrl } = require("../Middleware/s3.js");
const upload = require("../Middleware/upload")(
    "medical-history",
    AWS_BUCKET_RUSH_HOUR_UPLOADS
);


// Save or update history
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

// Upload attachments
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


// GET /api/files/signed-url?key=medical-history/userId/fileName.pdf
router.get("/signed-url", authenticate, async (req, res) => {
    const { key } = req.query;
    const signedUrl = await getS3SignedUrl(key, AWS_BUCKET_RUSH_HOUR_UPLOADS); // your S3 util function
    res.json({ url: signedUrl });
});

// Get all medical history for a user
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
