/**
 * @file Redux reducer for managing the make appointment state.
 * Handles fetching hospitals, fetching doctors, and creating appointments.
 *
 * @namespace store.reducers.makeAppointmentsReducer
 * @memberof store.reducers
 */

import * as types from "../actions/types";

/**
 * Initial state for the makeAppointments reducer.
 *
 * @constant
 * @memberof store.reducers.makeAppointmentsReducer
 * @type {Object}
 * @property {Array<Object>} hospitals - List of nearby hospitals.
 * @property {Array<Object>} doctors - List of available doctors.
 * @property {boolean} loading - Indicates if an API request is in progress.
 * @property {string|null} error - Error message, if any.
 * @property {boolean} appointmentSuccess - Flag to indicate appointment creation status.
 */
const initialState = {
  hospitals: [],
  doctors: [],
  loading: false,
  error: null,
  appointmentSuccess: false,
};

/**
 * Reducer for handling appointment-related actions such as fetching hospitals,
 * fetching doctors, and creating appointments.
 *
 * @function makeAppointmentsReducer
 * @memberof store.reducers.makeAppointmentsReducer
 * @param {Object} state - The current state of appointment data.
 * @param {Object} action - The Redux action dispatched.
 * @param {string} action.type - Action type constant.
 * @param {any} [action.payload] - The data or error from the action.
 * @returns {Object} New state after processing the action.
 */
const makeAppointmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_HOSPITALS_PENDING:
    case types.CREATE_APPOINTMENT_PENDING:
    case types.FETCH_DOCTORS_PENDING:
      return { ...state, loading: true, error: null, appointmentSuccess: false };

    case types.FETCH_HOSPITALS_SUCCESS:
      return { ...state, loading: false, hospitals: action.payload };

    case types.FETCH_DOCTORS_SUCCESS:
      return { ...state, loading: false, doctors: action.payload };

    case types.CREATE_APPOINTMENT_SUCCESS:
      return { ...state, loading: false, appointmentSuccess: true };

    case types.FETCH_HOSPITALS_ERROR:
    case types.FETCH_DOCTORS_ERROR:
    case types.CREATE_APPOINTMENT_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default makeAppointmentsReducer;
