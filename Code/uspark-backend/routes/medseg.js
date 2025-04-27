const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { uploadToS3 } = require('../Middleware/s3');
require('dotenv').config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/medseg/upload', upload.single('file'), async (req, res) => {
  let tempFilePath;
  try {
    console.log("➡️ POST /medseg/upload called");

    const { patientEmail } = req.body;
    if (!patientEmail) {
      return res.status(400).json({ message: "Patient Email is required." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    tempFilePath = req.file.path; // save the path

    const formData = new FormData();
    formData.append('file', fs.createReadStream(tempFilePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    console.log("➡️ Sending request to Hugging Face MedSeg API...");

    const hfResponse = await axios.post(
      'https://pranaychamala-uspark.hf.space/medseg',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'accept': 'application/json',
        },
        timeout: 60000,
      }
    );

    console.log("✅ Hugging Face API responded!");

    const hfData = hfResponse.data;

    if (!hfData || !hfData.segmentation_result) {
      throw new Error("Segmentation result not found.");
    }

    const base64String = hfData.segmentation_result;
    const segmentedBuffer = Buffer.from(base64String, 'base64');

    const safeEmail = patientEmail.replace(/[@.]/g, "_");
    const key = `segmented/${safeEmail}_${Date.now()}.png`;

    console.log("➡️ Uploading segmented image to S3...");

    const uploadResult = await uploadToS3(segmentedBuffer, key, 'image/png');

    console.log("✅ Image uploaded to S3 successfully:", uploadResult.Location);

    // ⭐ Only now, after everything, delete the file
    if (tempFilePath) {
      fs.unlinkSync(tempFilePath);
      console.log("🗑️ Temp file deleted after full success");
    }

    return res.status(200).json({
      message: 'Segmentation successful!',
      s3Url: uploadResult.Location,
    });

  } catch (error) {
    console.error("🔥 Error during segmentation/upload:");
    console.error(error.response?.data?.toString() || error.message);

    // ⭐ Cleanup temp file even in case of error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log("🗑️ Temp file cleaned up after error");
    }

    return res.status(500).json({ message: error.message || "Segmentation or upload failed." });
  }
});

module.exports = router;
