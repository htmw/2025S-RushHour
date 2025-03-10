const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("./s3"); // Import the S3 client

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Store verification documents in "verification-docs/{doctorId}/"
      const doctorId = req.user?.userId || "unknown";
      cb(null, `verification-docs/${doctorId}/${Date.now()}-${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

module.exports = upload;
