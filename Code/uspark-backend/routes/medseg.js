const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { uploadToS3 } = require('../Middleware/s3');
require('dotenv').config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/medseg/upload', upload.single('file'), async (req, res) => {
  try {
    console.log("➡️ POST /medseg/upload called");

    const { patientEmail } = req.body;
    if (!patientEmail) {
      return res.status(400).json({ message: "Patient Email is required." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Prepare form data to send to Hugging Face
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    console.log("➡️ Sending request to Hugging Face MedSeg API...");

    const response = await axios.post(
      'https://pranaychamala-uspark.hf.space/medseg',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'accept': 'application/json',
        },
        timeout: 60000,
      }
    );

    console.log("✅ Hugging Face API responded!");

    // Very important step: decoding base64 into Buffer
    const base64Data = response.data.segmentation_result;

    if (!base64Data) {
      console.error("🔥 Segmented image base64 not found in response!");
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ message: "Segmentation failed. No image returned." });
    }

    const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const segmentedBuffer = Buffer.from(cleanedBase64, 'base64');

    // Generate S3 Key
    const safeEmail = patientEmail.replace(/[@.]/g, "_");
    const key = `segmented/${safeEmail}_${Date.now()}.png`;

    console.log("➡️ Uploading segmented image to S3...");

    // Upload binary buffer to S3
    const uploadResult = await uploadToS3(segmentedBuffer, key, 'image/png');

    console.log("✅ Image uploaded to S3 successfully:", uploadResult.Location);

    // Clean up temp uploaded file
    fs.unlinkSync(req.file.path);

    // Return the S3 URL to frontend
    return res.status(200).json({
      message: 'Segmentation successful!',
      s3Url: uploadResult.Location,
    });

  } catch (error) {
    console.error("🔥 Error during segmentation/upload:");
    console.error(error.response?.data?.toString() || error.message);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: error.message || "Segmentation or upload failed." });
  }
});

module.exports = router;
