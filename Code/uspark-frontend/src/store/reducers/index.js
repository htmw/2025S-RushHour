/**
 * @file Combines and exports all Redux reducers for the application.
 *
 * @namespace store.reducers
 * @memberof store
 */

import authReducer from "./authReducer";
import dashboardReducer from "./dashboardReducer";
import onboardingReducer from "./onBoardingReducer";
import profileReducer from "./profileReducer";
import themeReducer from "./themeReducer";
import adminReducer from "./adminReducer";
import healthIssuesReducer from "./healthIssuesReducer";
import forgotPasswordReducer from "./forgotPasswordReducer";
import insuranceReducer from "./insuranceReducer";
import medicalHistoryReducer from "./medicalHistoryReducer";
import appointmentsReducer from "./appointments";
import makeAppointmentsReducer from "./makeAppointments";
import doctorAvailabilityReducer from "./doctorAvailabilityReducer";
import { doctorPatientsReducer } from "./doctorPatientsReducer";
import chatHistoryReducer from "./chatHistoryReducer"; // Import the chat history reducer
import assessmentReducer from "./assessmentReducer"; // Import the assessment reducer
/**
 * Root reducer object containing all application reducers.
 * Used in Redux store configuration.
 *
 * @constant
 * @memberof store.reducers
 * @type {Object}
 * @property {Function} auth - Reducer handling authentication state.
 * @property {Function} dashboard - Reducer managing dashboard data.
 * @property {Function} onBoarding - Reducer handling user onboarding state.
 * @property {Function} profileReducer - Reducer handling image uploads.
 * @property {Function} theme - Reducer managing theme settings.
 * @property {Function} admin - Reducer managing admin-related actions.
 * @property {Function} healthIssues - Reducer handling health issues.
 * @property {Function} forgotPassword - Reducer handling forgot password actions.
 * @property {Function} insurance - Reducer handling insurance data.
 */
export const reducer = {
  auth: authReducer,
  dashboard: dashboardReducer,
  onBoarding: onboardingReducer,
  profile: profileReducer,
  theme: themeReducer,
  admin: adminReducer,
  healthIssues: healthIssuesReducer,
  forgotPassword: forgotPasswordReducer,
  insurance: insuranceReducer,
  medicalHistory: medicalHistoryReducer,
  appointments: appointmentsReducer,
  makeAppointments: makeAppointmentsReducer,
  doctorAvailability: doctorAvailabilityReducer,
  doctorPatients: doctorPatientsReducer,
  chatHistory: chatHistoryReducer,
  assessments: assessmentReducer, // Add the assessment reducer here
};
