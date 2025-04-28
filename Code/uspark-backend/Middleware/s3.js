// s3.js

const AWS = require("aws-sdk");

require("dotenv").config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// ⭐ Add this missing function
const uploadToS3 = (
  fileBuffer,
  key,
  contentType,
  bucket = process.env.AWS_BUCKET_RUSH_HOUR_UPLOADS
) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    // ACL: 'public-read',// ⭐ so uploaded image is public and viewable
  };

  return s3.upload(params).promise();
};

const getS3SignedUrl = (key, Bucket, expiresIn = 60) => {
  const params = {
    Bucket,
    Key: key,
    Expires: expiresIn,
  };
  return s3.getSignedUrlPromise("getObject", params);
};

const deleteFromS3 = (key, bucket) => {
  const params = {
    Bucket: bucket,
    Key: key, // The key of the file to delete
  };

  return s3.deleteObject(params).promise();
};
module.exports = {
  s3,
  uploadToS3,
  getS3SignedUrl,
  deleteFromS3,
};
