/**
 * @file Redux reducer for managing doctor's availability data.
 * Handles actions for fetching and saving availability slots.
 *
 * @namespace store.reducers.doctorAvailabilityReducer
 * @memberof store.reducers
 */

import {
  FETCH_DOCTOR_AVAILABILITY_PENDING,
  FETCH_DOCTOR_AVAILABILITY_SUCCESS,
  FETCH_DOCTOR_AVAILABILITY_ERROR,
  SAVE_DOCTOR_AVAILABILITY_PENDING,
  SAVE_DOCTOR_AVAILABILITY_SUCCESS,
  SAVE_DOCTOR_AVAILABILITY_ERROR,
} from "../actions/types";

/**
 * Initial state for doctor's availability.
 *
 * @constant
 * @memberof store.reducers.doctorAvailabilityReducer
 * @type {Object}
 * @property {Array<Object>} availability - Array of availability slot objects.
 * @property {boolean} loading - Indicates whether data is being loaded or saved.
 * @property {string|null} error - Error message, if any occurred during API actions.
 */
const initialState = {
  availability: [],
  loading: false,
  error: null,
};

/**
 * Reducer for handling doctor availability state.
 *
 * @function doctorAvailabilityReducer
 * @memberof store.reducers.doctorAvailabilityReducer
 * @param {Object} state - The current state.
 * @param {Object} action - Redux action object.
 * @param {string} action.type - The action type identifier.
 * @param {any} [action.payload] - The payload with data or error.
 * @returns {Object} The updated state based on the dispatched action.
 */
const doctorAvailabilityReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DOCTOR_AVAILABILITY_PENDING:
    case SAVE_DOCTOR_AVAILABILITY_PENDING:
      return { ...state, loading: true, error: null };

    case FETCH_DOCTOR_AVAILABILITY_SUCCESS:
    case SAVE_DOCTOR_AVAILABILITY_SUCCESS:
      return { ...state, availability: action.payload, loading: false };

    case FETCH_DOCTOR_AVAILABILITY_ERROR:
    case SAVE_DOCTOR_AVAILABILITY_ERROR:
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export default doctorAvailabilityReducer;
