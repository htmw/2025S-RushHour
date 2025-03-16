const ENV = import.meta.env.VITE_ENV || "local";
console.log(ENV);
const config = {
  local: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  },
  staging: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL_STAGE,
  },
  prod: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL_PROD,
  },
};
console.log(config[ENV]);
// Export the correct config based on the environment
export default config[ENV];
