const { defineConfig } = require("cypress");
const dotenv = require("dotenv");

// Load environment variables from the correct `.env` file
dotenv.config({ path: `.env.${process.env.CYPRESS_ENV || "local"}` });

const environment = process.env.CYPRESS_ENV || "local";

const envConfig = {
  local: {
    baseUrl: "http://localhost:5173",
  },
  dev: {
    baseUrl: "https://uspark-frontend.vercel.app",
  },
  prod: {
    baseUrl: "https://example.com",
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
  },
});
