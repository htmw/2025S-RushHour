/**
 * @file api.js
 * @namespace src.store.api
 * @memberof src.store
 * Centralized API utility for making HTTP requests to the backend.
 *
 * This module sets up an `axios` instance with a predefined base URL and exports a collection of
 * reusable functions to interact with the backend API. It supports various features across the app
 * including:
 *
 * - Authentication (login, signup, OAuth, forgot/reset password)
 * - Onboarding (patient and doctor onboarding, verification uploads)
 * - Dashboard (fetching profile, updating profile)
 * - Healthcare operations (appointments, insurance, medical history)
 * - Admin tools (verifying doctors)
 * - Doctor/patient interactions (availability, detailed views)
 *
 * Each function abstracts the HTTP logic and includes standard headers like the Authorization token.
 */

import axios from "axios";
import config from "../../../config";
import { ApiSharp } from "@mui/icons-material";
/**
 * Base API URL from environment variables.
 * Defaults to localhost if not set.
 */
const API_BASE_URL = config.API_BASE_URL || "http://localhost:5001";
console.log({ API_BASE_URL });
/**
 * Axios instance with predefined base URL.
 */
export const api = axios.create({
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
 * API call to verify a doctor's status.
 *
 * @param {string} doctorId - The unique identifier of the doctor.
 * @param {string} decision - The verification decision (e.g., "approved" or "rejected").
 * @returns {Promise<Object>} Resolves with the verification response.
 */
export const verifyDoctorApi = (doctorId, decision) =>
  api.post(`/api/admin/verify-doctor/${doctorId}`, { decision });

export const adminDoctorApi = () => api.get(`/api/admin/doctors`);

export const fetchProfileApi = (token) =>
  api.get("/api/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to fetch dashboard data.
 *
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the dashboard data.
 */
export const fetchDashboardApi = (token) =>
  api.get("/api/dashboard/all", {
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
  api.post("/api/onboarding/doctor/verify", formData, {
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

/**
 * API request to add a new health issue.
 *
 * @param {Object} healthIssue - The health issue details.
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves when the health issue is added successfully.
 */
export const addHealthIssuesApi = ({ health_issue: healthIssue }, token) =>
  api.post(
    `/api/onboarding/health-issues`,
    { health_issue: healthIssue },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

/**
 * API request to fetch health issues.
 *
 * @param {string} query - The search query for health issues.
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the list of health issues.
 */
export const fetchHealthIssuesApi = (query, token) =>
  api
    .get(`/api/onboarding/health-issues?search=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data);

/**
 * API request to send a password reset link to a user.
 *
 * @param {string} email - The user's email address.
 * @returns {Promise<Object>} Resolves with the response of the API call.
 */
export const forgotPasswordApi = (email) =>
  api.post("/auth/forgot-password", { email });

/**
 * API request to reset a user's password.
 *
 * @param {string} email - The user's email address.
 * @param {string} token - The password reset token.
 * @param {string} newPassword - The new password.
 * @returns {Promise<Object>} Resolves with the response of the API call.
 */
export const resetPasswordApi = (email, token, newPassword) =>
  api.post("/auth/reset-password", { email, token, newPassword });

/**
 * API request to fetch nearby hospitals.
 *
 * @param {number} latitude - The current latitude.
 * @param {number} longitude - The current longitude.
 * @returns {Promise<Object>} Resolves with the list of nearby hospitals.
 */
export const hospitalsApi = (latitude, longitude) =>
  api.get(`/api/hospitals?lat=${latitude}&long=${longitude}`);

/**
 * API request to fetch appointments.
 *
 * @returns {Promise<Object>} Resolves with the list of appointments.
 */
export const appointmentsApi = () => api.post("/api/appointments");

/**
 * API request to create a new insurance.
 *
 * @param {Object} data - The insurance data.
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the created insurance.
 */
export const createInsuranceApi = (data, token) =>
  api.post("/api/insurance", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to fetch the current user's insurance.
 *
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the insurance data.
 */
export const fetchInsuranceApi = (token) =>
  api.get("/api/insurance", {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to upload a profile image.
 *
 * @param {string} token - The authentication token for API authorization.
 * @param {FormData} formData - The form data containing the profile image.
 * @returns {Promise<Object>} Resolves when the profile image is uploaded successfully.
 */
export const uploadProfileImageApi = (token, formData) =>
  api.post("/api/profile-image", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

/**
 * API request to fetch the current user's profile image.
 *
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the profile image data.
 */
export const fetchProfileImageApi = (token) =>
  api.get("/api/profile-image", {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to update a patient's profile.
 *
 * @param {string} token - The authentication token for API authorization.
 */
export const updatePatientProfileApi = (token, data) =>
  api.post("/api/profile/patient", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * API request to update a doctor's profile.
 *
 * @param {string} token - The authentication token for API authorization.
 * @param {Object} profileData - The profile data to update.
 * @returns {Promise<Object>} Resolves when the doctor profile is updated successfully.
 */
export const updateDoctorProfileApi = (token, profileData) =>
  api.post("/api/profile/doctor/update", profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to save a doctor's availability.
 *
 * @param {string} token - The authentication token for API authorization.
 * @param {Array<Object>} slots - The availability slots to save.
 * @returns {Promise<Object>} Resolves when the availability is saved successfully.
 */

export const saveDoctorAvailabilityApi = (token, slots) =>
  api.post(
    "/api/profile/doctor/availability",
    { slots },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

/**
 * API request to update a doctor's availability slot.
 *
 * @param {string} token - The authentication token for API authorization.
 * @param {Object} slot - The availability slot to update.
 * @returns {Promise<Object>} Resolves when the availability slot is updated successfully.
 */
export const updateDoctorAvailabilityApi = (token, slot) =>
  api.put(`/api/profile/doctor/availability/${slot._id}`, slot, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to fetch a doctor's availability.
 *
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the doctor's availability data.
 */

export const fetchDoctorAvailabilityApi = (token) =>
  api.get("/api/profile/doctor/availability", {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to create a new medical history.
 *
 * @param {string} token - The authentication token for API authorization.
 * @param {Object} data - The medical history data to create.
 * @returns {Promise<Object>} Resolves when the medical history is created successfully.
 */
export const createMedicalHistoryApi = (token, data) =>
  api.post("/api/medical-history", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to fetch a user's medical history.
 *
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the user's medical history data.
 */
export const fetchMedicalHistoryApi = (token) =>
  api.get("/api/medical-history", {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to fetch a user's appointments.
 *
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the user's appointments data.
 */
export const fetchAppointmentsApi = (token) =>
  api.get("/api/appointments", {
    headers: { Authorization: `Bearer ${token}` },
  });
/**
 * API request to create a new appointment.
 *
 * @param {Object} payload - The appointment data to create.
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves when the appointment is created successfully.
 */
export const createAppointmentApi = (payload, token) =>
  api.post("/api/appointments", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to update an appointment.
 *
 * @param {string} id - The unique identifier of the appointment to update.
 * @param {Object} payload - The appointment data to update.
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves when the appointment is updated successfully.
 */
export const updateAppointmentApi = (id, payload, token) =>
  api.put(`/api/appointments/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to delete an appointment.
 *
 * @param {string} id - The unique identifier of the appointment to delete.
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves when the appointment is deleted successfully.
 */
export const deleteAppointmentApi = (id, token) =>
  api.delete(`/api/appointments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to fetch nearby hospitals.
 *
 * @param {number} lat - The current latitude.
 * @param {number} long - The current longitude.
 * @param {string} [search=""] - The search query to filter hospitals.
 * @returns {Promise<Object>} Resolves with the list of nearby hospitals.
 */
export const fetchHospitalsApi = (lat, long, search = "") =>
  api.get(`/api/hospitals?lat=${lat}&long=${long}&search=${search}`);

/**
 * API request to fetch all doctors.
 *
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the list of doctors.
 */
export const fetchDoctorsApi = (token) =>
  api.get("/api/doctors", {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to fetch the list of patients associated with a doctor.
 *
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the list of patients.
 */
export const fetchDoctorPatientsApi = (token) =>
  api.get("/api/doctors/patients", {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to fetch the details of a patient associated with a doctor.
 *
 * @param {string} token - The authentication token for API authorization.
 * @param {string} patientId - The unique identifier of the patient.
 * @returns {Promise<Object>} Resolves with the patient's details.
 */
export const fetchDoctorPatientDetailsApi = (token, patientId) =>
  api.get(`/api/doctors/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * API request to save chat history.
 *
 * @param {string} token - The authentication token for API authorization.
 * @param {Object} formData - The chat history data to save.
 * @returns {Promise<Object>} Resolves when the chat history is saved successfully.
 */
export const saveChatHistoryApi = (token, formData) =>
  api.post(`/api/chathistory/save`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

/**
 * API request to start a chat with the bot.
 *
 * @returns {Promise<Object>} Resolves with the session ID and bot's initial reply.
 */
export const startChatWithBotApi = () =>
  axios.post(
    "https://pranaychamala-uspark.hf.space/chat/start",
    {},
    {
      headers: { "Content-Type": "application/json" },
    }
  );

/**
 * API request to send a message to the bot.
 *
 * @param {string} sessionId - The session ID of the chat.
 * @param {string} message - The user's message.
 * @returns {Promise<Object>} Resolves with the bot's reply.
 */
export const sendMessageWithBotApi = (sessionId, message) =>
  axios.post(
    "https://pranaychamala-uspark.hf.space/chat/message",
    {
      session_id: sessionId,
      message,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

/**
 * API request to fetch assessments.
 *
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the assessments data.
 */
export const fetchAssessmentsApi = async (token) => {
  return api.get("/api/assessments", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * API request to delete an assessment.
 *
 * @param {string} token - The authentication token for API authorization.
 * @param {string} id - The unique identifier of the assessment to delete.
 * @returns {Promise<Object>} Resolves when the assessment is deleted successfully.
 */
export const deleteAssessmentApi = async (token, id) => {
  return api.delete(`/api/assessments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
