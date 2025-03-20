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
console.log(config[ENV]);
// Export the correct config based on the environment
module.exports = config[ENV];
