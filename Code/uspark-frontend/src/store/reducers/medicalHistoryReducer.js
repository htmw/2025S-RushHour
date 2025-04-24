/**
 * @file Redux reducer for managing patient medical history state.
 * Handles creating and fetching medical history records.
 *
 * @namespace store.reducers.medicalHistoryReducer
 * @memberof store.reducers
 */

import * as types from "../actions/types";

/**
 * Initial state for the medicalHistory reducer.
 *
 * @constant
 * @memberof store.reducers.medicalHistoryReducer
 * @type {Object}
 * @property {boolean} loading - Indicates if an API request is in progress.
 * @property {string|null} error - Stores error messages, if any.
 * @property {Array<Object>} histories - List of medical history records.
 */
const initialState = {
  loading: false,
  error: null,
  histories: [],
};

/**
 * Reducer for handling actions related to patient medical history.
 *
 * @function medicalHistoryReducer
 * @memberof store.reducers.medicalHistoryReducer
 * @param {Object} state - The current medical history state.
 * @param {Object} action - Redux action dispatched.
 * @param {string} action.type - The type of the action.
 * @param {any} [action.payload] - The data or error payload.
 * @returns {Object} New state after applying the action.
 */
const medicalHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_MEDICAL_HISTORY_PENDING:
    case types.FETCH_MEDICAL_HISTORY_PENDING:
      return { ...state, loading: true, error: null };

    case types.CREATE_MEDICAL_HISTORY_SUCCESS:
      return { ...state, loading: false };

    case types.FETCH_MEDICAL_HISTORY_SUCCESS:
      return { ...state, loading: false, histories: action.payload };

    case types.CREATE_MEDICAL_HISTORY_ERROR:
    case types.FETCH_MEDICAL_HISTORY_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default medicalHistoryReducer;
