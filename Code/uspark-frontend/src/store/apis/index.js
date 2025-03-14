import axios from "axios";
import config from "../../../config";
/**
 * Base API URL from environment variables.
 * Defaults to localhost if not set.
 */
const API_BASE_URL = config.API_BASE_URL || "http://localhost:5001";

/**
 * Axios instance with predefined base URL.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * API request to log in a user with credentials.
 *
 * @param {Object} credentials - The user's email and password.
 * @returns {Promise<Object>} Response containing authentication token.
 */
export const loginApi = (credentials) => api.post("/auth/login", credentials);

/**
 * API request to log in a user using OAuth (Google, Apple, etc.).
 *
 * @param {Object} providerData - OAuth provider data.
 * @returns {Promise<Object>} Response containing authentication token.
 */
export const oauthLoginApi = (providerData) =>
  api.post("/auth/oauth", providerData);

/**
 * API request to sign up a new user.
 *
 * @param {Object} userData - User registration details.
 * @returns {Promise<Object>} Response containing authentication token.
 */
export const signupApi = (userData) => api.post("/auth/signup", userData);

/**
 * API request to sign up a new user via OAuth.
 *
 * @param {Object} providerData - OAuth provider data.
 * @returns {Promise<Object>} Response containing authentication token.
 */
export const oAuthSignupApi = (providerData) =>
  api.post("/auth/oauth", providerData);

/**
 * API call to fetch doctors.
 *
 * @returns {Promise<Object>} Resolves with the list of doctors.
 */
export const fetchDoctorsApi = () => api.get("/api/admin/doctors");

/**
 * API call to verify a doctor's status.
 *
 * @param {string} doctorId - The unique identifier of the doctor.
 * @param {string} decision - The verification decision (e.g., "approved" or "rejected").
 * @returns {Promise<Object>} Resolves with the verification response.
 */
export const verifyDoctorApi = (doctorId, decision) =>
  api.post(`/api/admin/verify-doctor/${doctorId}`, { decision });

/**
 * API request to fetch dashboard data.
 *
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the dashboard data.
 */
export const fetchDashboardApi = (token) =>
  api.get("/api/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to upload verification documents.
 *
 * @param {string} token - The authentication token for API authorization.
 * @param {FormData} formData - The form data containing the verification documents.
 * @returns {Promise<Object>} Resolves when the upload is successful.
 */
export const uploadDocsApi = (token, formData) =>
  api.post("/api/dashboard/doctor/verify", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

/**
 * API request to onboard a doctor.
 *
 * @param {FormData} formData - The form data containing onboarding details.
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves when the onboarding request is successful.
 */
export const doctorOnboardingApi = (formData, token) =>
  api.post("/api/onboarding/doctor", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to onboard a patient.
 *
 * @param {FormData} formData - The form data containing onboarding details.
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves when the onboarding request is successful.
 */
export const patientOnboardingApi = (formData, token) =>
  api.post("/api/onboarding/patient", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
