/**
 * @file Redux reducer for managing admin-related state.
 * Handles fetching and verifying doctors.
 *
 * @namespace store.reducers.adminReducer
 * @memberof store.reducers
 */

import * as types from "../actions/types";

/**
 * Initial state for the admin reducer.
 * @constant
 * @memberof store.reducers.adminReducer
 * @type {Object}
 * @property {Array<Object>} doctors - List of doctors.
 * @property {boolean} loading - Indicates if a request is in progress.
 * @property {string|null} error - Stores error messages, if any.
 */
const initialState = {
  doctors: [],
  loading: false,
  error: null,
};

/**
 * Admin reducer for handling doctor-related actions.
 *
 * @memberof store.reducers.adminReducer
 * @function adminReducer
 * @param {Object} state - The current state.
 * @param {Object} action - Redux action object.
 * @param {string} action.type - The action type.
 * @param {any} [action.payload] - The action payload.
 * @returns {Object} The updated state.
 */
const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DOCTORS_PENDING:
      return { ...state, loading: true, error: null };

    case types.FETCH_DOCTORS_SUCCESS:
      return { ...state, loading: false, doctors: action.payload };

    case types.FETCH_DOCTORS_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.VERIFY_DOCTOR_PENDING:
      return { ...state, loading: true };

    case types.VERIFY_DOCTOR_SUCCESS:
      return { ...state, loading: false };

    case types.VERIFY_DOCTOR_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default adminReducer;
