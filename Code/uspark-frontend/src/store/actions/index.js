import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";
import * as types from "./types";

/**
 * Reusable action creator for async actions (Pending, Success, Error).
 *
 * @param {string} baseType - The base action type (e.g., 'FETCH_DASHBOARD_DETAILS').
 * @returns {object} - Action creators for trigger, pending, success, and error states.
 */
const createAsyncActions = (baseType) => {
  // The main function that acts as the default action
  const action = (payload, navigate) => ({
    type: baseType,
    payload,
    meta: { navigate }, // Move navigate to meta
  });

  // Attaching methods to the function
  action.pending = (navigate) => ({
    type: `${baseType}_PENDING`,
    meta: { navigate },
  });

  action.success = (data, navigate) => ({
    type: `${baseType}_SUCCESS`,
    payload: data,
    meta: { navigate },
  });

  action.error = (error, navigate) => ({
    type: `${baseType}_ERROR`,
    payload: error,
    meta: { navigate },
  });

  return action;
};

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
export const setTheme = createAsyncActions(types.SET_THEME);
