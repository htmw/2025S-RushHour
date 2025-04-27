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
  try {
    console.log("➡️ POST /medseg/upload called");

    const { patientEmail } = req.body;
    if (!patientEmail) {
      return res.status(400).json({ message: "Patient Email is required." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
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
        responseType: 'arraybuffer',
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 60000,
      }
    );

    console.log("✅ Hugging Face segmentation API responded successfully");

    const segmentedBuffer = Buffer.from(response.data);

    const safeEmail = patientEmail.replace(/[@.]/g, "_");
    const key = `segmented/${safeEmail}_${Date.now()}.png`;

    console.log("➡️ Uploading segmented image to S3...");

    const uploadResult = await uploadToS3(segmentedBuffer, key, 'image/png');

    console.log("✅ Image uploaded to S3 successfully:", uploadResult.Location);

    fs.unlinkSync(req.file.path); // cleanup uploaded file

    const base64Image = `data:image/png;base64,${segmentedBuffer.toString('base64')}`;

    return res.status(200).json({
      message: 'Segmentation successful!',
      base64Image,         // for direct frontend display
      s3Url: uploadResult.Location, // for saving permanent link
    });

  } catch (error) {
    console.error("🔥 Error during segmentation/upload:");
    console.error(error.response?.data?.toString() || error.message);
    if (req.file?.path) fs.unlinkSync(req.file.path);
    return res.status(500).json({ message: error.message || "Segmentation or upload failed." });
  }
});

module.exports = router;
