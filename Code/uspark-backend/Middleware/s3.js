// s3.js (AWS SDK v2)
const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const getS3SignedUrl = (key, Bucket, expiresIn = 60) => {
  const params = {
    Bucket,
    Key: key,
    Expires: expiresIn,
  };
  return s3.getSignedUrlPromise("getObject", params);
};

module.exports = {
  s3,
  getS3SignedUrl,
};
