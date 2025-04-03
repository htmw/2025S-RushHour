/**
 * @file Defines Redux action creators for asynchronous operations.
 *
 * Uses a reusable function to generate action creators for Pending, Success, and Error states.
 *
 * @namespace store.actions
 * @memberof store
 */

import * as types from "./types";

/**
 * Reusable action creator for async actions (Pending, Success, Error).
 *
 * @function
 * @memberof store.actions
 * @param {string} baseType - The base action type (e.g., 'FETCH_DASHBOARD').
 * @returns {Object} Action creators for trigger, pending, success, and error states.
 */
const createAsyncActions = (baseType) => {
  /**
   * Default action creator function.
   *
   * @function
   * @memberof store.actions.createAsyncActions
   * @param {any} payload - The data to be passed to the action.
   * @param {Function} [navigate] - Optional navigation function.
   * @returns {Object} Redux action.
   */
  const action = (payload, navigate) => ({
    type: baseType,
    payload,
    meta: { navigate },
  });

  /**
   * Generates a pending action.
   *
   * @function
   * @memberof store.actions.createAsyncActions
   * @param {Function} [navigate] - Optional navigation function.
   * @returns {Object} Redux action for pending state.
   */
  action.pending = (navigate) => ({
    type: `${baseType}_PENDING`,
    meta: { navigate },
  });

  /**
   * Generates a success action.
   *
   * @function
   * @memberof store.actions.createAsyncActions
   * @param {any} data - The successful response data.
   * @param {Function} [navigate] - Optional navigation function.
   * @returns {Object} Redux action for success state.
   */
  action.success = (data, navigate) => ({
    type: `${baseType}_SUCCESS`,
    payload: data,
    meta: { navigate },
  });

  /**
   * Generates an error action.
   *
   * @function
   * @memberof store.actions.createAsyncActions
   * @param {any} error - The error message or object.
   * @param {Function} [navigate] - Optional navigation function.
   * @returns {Object} Redux action for error state.
   */
  action.error = (error, navigate) => ({
    type: `${baseType}_ERROR`,
    payload: error,
    meta: { navigate },
  });

  return action;
};

/**
 * Redux action creators for various async operations.
 * These are generated using `createAsyncActions()`.
 *
 * @constant
 * @memberof store.actions
 * @type {Object}
 */
export const fetchDashboard = createAsyncActions(types.FETCH_DASHBOARD);
export const login = createAsyncActions(types.LOGIN);
export const oAuthLogin = createAsyncActions(types.OAUTH_LOGIN);
export const signup = createAsyncActions(types.SIGNUP);
export const oAuthSignup = createAsyncActions(types.OAUTH_SIGNUP);
export const doctorOnboarding = createAsyncActions(types.DOCTOR_ONBOARDING);
export const logoutUser = createAsyncActions(types.LOGOUT_USER);
export const patientOnboarding = createAsyncActions(types.PATIENT_ONBOARDING);
export const roleSelection = createAsyncActions(types.ROLE_SELECION);
export const uploadProfileImage = createAsyncActions(
  types.UPLOAD_PROFILE_IMAGE
);
export const fetchProfileImage = createAsyncActions(types.FETCH_PROFILE_IMAGE);

export const setTheme = createAsyncActions(types.SET_THEME);
export const fetchDoctors = createAsyncActions(types.FETCH_DOCTORS);
export const verifyDoctor = createAsyncActions(types.VERIFY_DOCTOR);
export const uploadVerificationDocs = createAsyncActions(
  types.UPLOAD_VERIFICATION_DOCS
);
export const fetchHealthIssues = createAsyncActions(types.FETCH_HEALTH_ISSUES);
export const addHealthIssue = createAsyncActions(types.ADD_HEALTH_ISSUE);
export const forgotPassword = createAsyncActions(types.FORGOT_PASSWORD);
export const createInsurance = createAsyncActions(types.CREATE_INSURANCE);
export const fetchInsurance = createAsyncActions(types.FETCH_INSURANCE);
export const updatePatientProfile = createAsyncActions(
  types.UPDATE_PATIENT_PROFILE
);

export const updateDoctorProfile = createAsyncActions(
  types.UPDATE_DOCTOR_PROFILE
);

export const createMedicalHistory = createAsyncActions(
  types.CREATE_MEDICAL_HISTORY
);
export const fetchMedicalHistory = createAsyncActions(
  types.FETCH_MEDICAL_HISTORY
);




