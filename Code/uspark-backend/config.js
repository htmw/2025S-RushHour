require("dotenv").config();

const ENV = process.env.NODE_ENV || "local";
console.log(ENV);
const config = {
  local: {
    FRONTEND_URL: process.env.FRONTEND_URL,
  },
  staging: {
    FRONTEND_URL: process.env.STAGE_FRONTEND_URL,
  },
  prod: {
    FRONTEND_URL: process.env.PROD_FRONTEND_URL,
  },
};
const finalConfig = config[ENV];
finalConfig.AWS_BUCKET_RUSH_HOUR_UPLOADS =
  process.env.AWS_BUCKET_RUSH_HOUR_UPLOADS;

finalConfig.AWS_BUCKET_PUBLIC_USPARK_DOCS =
  process.env.AWS_BUCKET_PUBLIC_USPARK_DOCS;

finalConfig.AWS_BUCKET_USPARK_MEDICAL_HISTORY = process.env.AWS_BUCKET_USPARK_MEDICAL_HISTORY;

console.log(finalConfig);
// Export the correct config based on the environment
module.exports = config[ENV];
