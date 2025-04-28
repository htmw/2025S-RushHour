const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const { uploadToS3, deleteFromS3 } = require("../Middleware/s3");
const MedicalHistory = require("../Models/MedicalHistory");
const DoctorSegmentation = require("../Models/DoctorSegmentation");

const { AWS_BUCKET_RUSH_HOUR_UPLOADS } = require("../config.js");
const { default: authenticate } = require("../Middleware/authenticate.js");
require("dotenv").config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("➡️ POST /medseg/upload called");

    const { imageUrl, patientId, medicalHistoryId } = req.body;

    let filePath;

    if (imageUrl) {
      // Download the image from the provided URL
      console.log("➡️ Downloading image from URL...");
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      filePath = `uploads/${Date.now()}_downloaded_image.png`;
      fs.writeFileSync(filePath, response.data);
    } else if (req.file) {
      // Use the uploaded file
      filePath = req.file.path;
    } else {
      return res.status(400).json({ message: "No image provided." });
    }

    // Prepare form data to send to Hugging Face
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), {
      filename: "image.png",
      contentType: "image/png",
    });

    console.log("➡️ Sending request to Hugging Face MedSeg API...");
    const hfResponse = await axios.post(
      "https://pranaychamala-uspark.hf.space/medseg",
      form,
      {
        headers: { ...form.getHeaders(), accept: "application/json" },
        timeout: 60000,
      }
    );

    console.log("✅ Hugging Face API responded!");

    const base64Data = hfResponse.data.segmentation_result;
    if (!base64Data) {
      console.error("🔥 Segmented image base64 not found in response!");
      fs.unlinkSync(filePath);
      return res.status(500).json({ message: "Segmentation failed." });
    }

    const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const segmentedBuffer = Buffer.from(cleanedBase64, "base64");

    const originalFileName =
      req.file?.originalname || imageUrl.split("/").pop();
    const fileNameWithoutExt = originalFileName.replace(/\.[^/.]+$/, "");
    const fileExtension = originalFileName.split(".").pop();
    const segmentedFileName = `${fileNameWithoutExt}_segmented.${fileExtension}`;

    // Generate S3 Key
    const key = `segmented/${patientId || "unknown"}/${segmentedFileName}`;

    console.log("➡️ Uploading segmented image to S3...");
    const uploadResult = await uploadToS3(segmentedBuffer, key, "image/png");

    console.log("✅ Image uploaded to S3 successfully:", uploadResult.Location);

    // Store the segmented image URL in the MedicalHistory record
    if (medicalHistoryId) {
      const medicalHistory = await MedicalHistory.findById(medicalHistoryId);
      if (!medicalHistory) {
        console.error("🔥 Medical history record not found!");
        return res.status(404).json({ message: "Medical history not found." });
      }

      // Replace the old URL with the new one
      const existingIndex = medicalHistory.segmentedAttachments.findIndex(
        (url) => url.includes(segmentedFileName)
      );
      if (existingIndex !== -1) {
        medicalHistory.segmentedAttachments[existingIndex] =
          uploadResult.Location;
        console.log("✅ Replaced old segmented image URL with the new one.");
      } else {
        medicalHistory.segmentedAttachments.push(uploadResult.Location);
        console.log("✅ Segmented image URL added to medical history record.");
      }

      await medicalHistory.save();
    }

    // Clean up temp files
    fs.unlinkSync(filePath);

    return res.status(200).json({
      message: "Segmentation successful!",
      s3Url: uploadResult.Location,
    });
  } catch (error) {
    console.error("🔥 Error during segmentation/upload:", error.message);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: "Segmentation or upload failed." });
  }
});

router.post(
  "/doctor/upload",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("➡️ POST /medseg/doctor/upload called");

      const { userId } = req.user;

      if (!userId) {
        return res.status(400).json({ message: "Doctor ID is required." });
      }

      let filePath;

      if (req.file) {
        // Use the uploaded file
        filePath = req.file.path;
      } else {
        return res.status(400).json({ message: "No file provided." });
      }

      // Upload the original file to S3
      const originalFileName = req.file.originalname;
      const originalKey = `doctor_uploads/${userId}/${Date.now()}_${originalFileName}`;
      const originalUploadResult = await uploadToS3(
        fs.readFileSync(filePath),
        originalKey,
        req.file.mimetype
      );

      console.log(
        "✅ Original file uploaded to S3:",
        originalUploadResult.Location
      );

      // Prepare form data to send to Hugging Face for segmentation
      const form = new FormData();
      form.append("file", fs.createReadStream(filePath), {
        filename: originalFileName,
        contentType: req.file.mimetype,
      });

      console.log("➡️ Sending request to Hugging Face MedSeg API...");
      const hfResponse = await axios.post(
        "https://pranaychamala-uspark.hf.space/medseg",
        form,
        {
          headers: { ...form.getHeaders(), accept: "application/json" },
          timeout: 60000,
        }
      );

      console.log("✅ Hugging Face API responded!");

      const base64Data = hfResponse.data.segmentation_result;
      if (!base64Data) {
        console.error("🔥 Segmented image base64 not found in response!");
        fs.unlinkSync(filePath);
        return res.status(500).json({ message: "Segmentation failed." });
      }

      const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
      const segmentedBuffer = Buffer.from(cleanedBase64, "base64");
      const segmentedKey = `doctor_uploads/${userId}/${Date.now()}_segmented.png`;

      // Upload the segmented image to S3
      const segmentedUploadResult = await uploadToS3(
        segmentedBuffer,
        segmentedKey,
        "image/png"
      );

      console.log(
        "✅ Segmented image uploaded to S3:",
        segmentedUploadResult.Location
      );

      // Store both images in the DoctorSegmentation collection
      const doctorSegmentation = new DoctorSegmentation({
        doctorId: userId,
        originalImage: originalUploadResult.Location,
        segmentedImage: segmentedUploadResult.Location,
        uploadedAt: new Date(),
      });

      await doctorSegmentation.save();

      console.log(
        "✅ Images stored in DoctorSegmentation collection:",
        doctorSegmentation
      );

      // Clean up temp files
      fs.unlinkSync(filePath);

      return res.status(200).json({
        message: "Segmentation successful!",
        originalImage: originalUploadResult.Location,
        segmentedImage: segmentedUploadResult.Location,
      });
    } catch (error) {
      console.error("🔥 Error during segmentation/upload:", error.message);
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(500)
        .json({ message: "Segmentation or upload failed." });
    }
  }
);

router.delete("/delete", authenticate, async (req, res) => {
  const { segmentedUrl, medicalHistoryId } = req.body;

  try {
    // Remove the image from S3
    await deleteFromS3(segmentedUrl, AWS_BUCKET_RUSH_HOUR_UPLOADS);

    // Update the medical history record
    const medicalHistory = await MedicalHistory.findById(medicalHistoryId);
    if (medicalHistory) {
      medicalHistory.segmentedAttachments =
        medicalHistory.segmentedAttachments.filter(
          (url) => url !== segmentedUrl
        );
      await medicalHistory.save();
    }

    res.status(200).json({ message: "Segmented image deleted successfully." });
  } catch (error) {
    console.error("Error deleting segmented image:", error);
    res.status(500).json({ message: "Failed to delete segmented image." });
  }
});

router.get("/list", authenticate, async (req, res) => {
  try {
    const { userId } = req.user; // Extract userId from the token

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch all segmentations created by the user (doctor)
    const segmentations = await DoctorSegmentation.find({ doctorId: userId })
      .select("originalImage segmentedImage uploadedAt")
      .lean();

    res.status(200).json({ segmentations });
  } catch (error) {
    console.error("Error fetching segmentations:", error);
    res.status(500).json({ message: "Failed to fetch segmentations." });
  }
});

router.post("/resegment", authenticate, async (req, res) => {
  const { imageUrl, doctorId } = req.body;

  try {
    // Re-segment the image (reuse the segmentation logic from /medseg/upload)
    const response = await axios.post(
      "https://pranaychamala-uspark.hf.space/medseg",
      { imageUrl }
    );
    const base64Data = response.data.segmentation_result;

    if (!base64Data) {
      return res.status(500).json({ message: "Re-segmentation failed." });
    }

    // Upload the new segmented image to S3
    const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const segmentedBuffer = Buffer.from(cleanedBase64, "base64");
    const key = `segmented/${doctorId}/${Date.now()}_resegmented.png`;

    const uploadResult = await uploadToS3(segmentedBuffer, key, "image/png");

    res.status(200).json({
      message: "Re-segmentation successful!",
      s3Url: uploadResult.Location,
    });
  } catch (error) {
    console.error("Error during re-segmentation:", error);
    res.status(500).json({ message: "Re-segmentation failed." });
  }
});

module.exports = router;
