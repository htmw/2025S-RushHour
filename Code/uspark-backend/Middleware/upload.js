const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("./s3").s3;

const createUploadMiddleware = (keyPrefix = "uploads", bucket = process.env.AWS_BUCKET_NAME) => {
  return multer({
    storage: multerS3({
      s3,
      bucket,
      key: (req, file, cb) => {
        const userId = req.user?.userId || "anonymous";
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.originalname}`;
        const s3Key = `${keyPrefix}/${userId}/${filename}`;
        cb(null, s3Key);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
  });
};

module.exports = createUploadMiddleware;
