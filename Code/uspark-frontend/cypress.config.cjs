const { defineConfig } = require("cypress");
const dotenv = require("dotenv");
dotenv.config();
const environment = process.env.CYPRESS_ENV || "local";

const envConfig = {
  local: {
    baseUrl: "http://localhost:5173",
    backendUrl: "http://localhost:5001",
  },
  staging: {
    baseUrl: "https://staging-lac.vercel.app",
    backendUrl: "https://two025s-rushhour.onrender.com",
  },
  prod: {
    baseUrl: "https://example.com",
    backendUrl: "https://two025s-rushhour.onrender.com",
  },
};

const selectedBaseUrl =
  envConfig[environment]?.baseUrl || "http://localhost:5173";

console.log(`🛠️ Cypress is running in '${environment}' environment`);
console.log(`🌍 Base URL: ${selectedBaseUrl}`);

module.exports = defineConfig({
  e2e: {
    baseUrl: selectedBaseUrl,
    chromeWebSecurity: false,
    env: {
      ENVIRONMENT: environment,
    },
    video: true,
    screenshotOnRunFailure: true,
  },
});
