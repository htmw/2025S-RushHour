/**
 * @fileoverview Redux reducer for handling user onboarding state.
 * Manages doctor and patient onboarding processes, role selection, and loading states.
 */

import * as types from "../actions/types";

/**
 * Initial state for the onboarding reducer.
 * @constant
 * @type {Object}
 * @property {Object|null} doctorData - Stores the doctor's onboarding data.
 * @property {Object|null} patientData - Stores the patient's onboarding data.
 * @property {string} role - Stores the selected role (e.g., "doctor" or "patient").
 * @property {boolean} loading - Indicates if an onboarding request is in progress.
 * @property {string|null} error - Stores error messages, if any.
 */
const initialState = {
  doctorData: null,
  patientData: null,
  role: "",
  loading: false,
  error: null,
};

/**
 * Onboarding reducer for handling doctor and patient onboarding actions.
 *
 * @function onboardingReducer
 * @param {Object} state - The current onboarding state.
 * @param {Object} action - Redux action object.
 * @param {string} action.type - The action type.
 * @param {any} [action.payload] - The action payload containing onboarding data or errors.
 * @returns {Object} The updated onboarding state.
 */
const onboardingReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.DOCTOR_ONBOARDING_PENDING:
    case types.PATIENT_ONBOARDING_PENDING:
      return { ...state, loading: true, error: null };

    case types.DOCTOR_ONBOARDING_SUCCESS:
      return { ...state, loading: false, doctorData: action.payload };

    case types.DOCTOR_ONBOARDING_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.PATIENT_ONBOARDING_SUCCESS:
      return { ...state, loading: false, patientData: action.payload };

    case types.ROLE_SELECION:
      return { ...state, loading: false, role: action.payload };

    default:
      return state;
  }
};

export default onboardingReducer;
