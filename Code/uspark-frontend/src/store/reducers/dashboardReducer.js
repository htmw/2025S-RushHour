/**
 * @file Redux reducer for managing dashboard state.
 * Handles fetching user dashboard data and document uploads.
 *
 * @namespace store.reducers.dashboardReducer
 * @memberof store.reducers
 */

import * as types from "../actions/types";

/**
 * Initial state for the dashboard reducer.
 * @constant
 * @memberof store.reducers.dashboardReducer
 * @type {Object}
 * @property {Object|null} userData - The user's dashboard data.
 * @property {boolean} loading - Indicates if a dashboard-related request is in progress.
 * @property {string|null} error - Stores error messages, if any.
 */
const initialState = {
  userData: null,
  loading: false,
  error: null,
};

/**
 * Dashboard reducer for handling dashboard data retrieval and document uploads.
 *
 * @memberof store.reducers.dashboardReducer
 * @function dashboardReducer
 * @param {Object} state - The current dashboard state.
 * @param {Object} action - Redux action object.
 * @param {string} action.type - The action type.
 * @param {any} [action.payload] - The action payload containing dashboard data or error messages.
 * @returns {Object} The updated dashboard state.
 */
const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DASHBOARD_PENDING:
    case types.UPDATE_PATIENT_PROFILE_PENDING:
    case types.UPDATE_DOCTOR_PROFILE_PENDING:
      return { ...state, loading: true, error: null };

    case types.FETCH_DASHBOARD_SUCCESS:
      return { ...state, loading: false, userData: action.payload };

    case types.FETCH_DASHBOARD_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.UPLOAD_VERIFICATION_DOCS_PENDING:
      return { ...state, loading: true };

    case types.UPLOAD_VERIFICATION_DOCS_SUCCESS:
      return { ...state, loading: false };

    case types.UPLOAD_VERIFICATION_DOCS_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.LOGOUT_USER:
      return { ...state, userData: null };

    case types.UPDATE_PATIENT_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userData: {
          ...state.userData,
          ...action.payload,
        },
      };

    case types.UPDATE_DOCTOR_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userData: {
          ...state.userData,
          ...action.payload.doctor,
        },
      };

    case types.UPDATE_PATIENT_PROFILE_ERROR:
    case types.UPDATE_DOCTOR_PROFILE_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default dashboardReducer;
