/**
 * @file Redux reducer for managing state related to doctor-managed patients.
 * Handles fetching a list of patients and individual patient details.
 *
 * @namespace store.reducers.doctorPatientsReducer
 * @memberof store.reducers
 */

import {
  FETCH_DOCTOR_PATIENTS_PENDING,
  FETCH_DOCTOR_PATIENTS_SUCCESS,
  FETCH_DOCTOR_PATIENTS_ERROR,
  FETCH_DOCTOR_PATIENT_DETAILS_PENDING,
  FETCH_DOCTOR_PATIENT_DETAILS_SUCCESS,
  FETCH_DOCTOR_PATIENT_DETAILS_ERROR,
  SEGMENT_IMAGE_PENDING,
  SEGMENT_IMAGE_SUCCESS,
  SEGMENT_IMAGE_ERROR,
} from "../actions/types";

/**
 * Initial state for doctor patients reducer.
 *
 * @constant
 * @memberof store.reducers.doctorPatientsReducer
 * @type {Object}
 * @property {Array<Object>} patients - List of patients managed by the doctor.
 * @property {Object|null} patientDetails - Detailed info for a selected patient.
 * @property {boolean} loading - Indicates if a request is currently in progress.
 * @property {string|null} error - Error message, if any occurred during API actions.
 * @property {Object|null} segmentedImage - Segmented image data.
 */
const initialState = {
  patients: [],
  patientDetails: null,
  loading: false,
  error: null,
  segmentedImage: null, // Add segmented image state
};

/**
 * Reducer handling doctor patient state updates.
 *
 * @function doctorPatientsReducer
 * @memberof store.reducers.doctorPatientsReducer
 * @param {Object} state - The current reducer state.
 * @param {Object} action - Redux action dispatched.
 * @param {string} action.type - Action type constant.
 * @param {any} [action.payload] - Payload with data or error.
 * @returns {Object} New state after applying the action.
 */
export const doctorPatientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DOCTOR_PATIENTS_PENDING:
    case FETCH_DOCTOR_PATIENT_DETAILS_PENDING:
    case SEGMENT_IMAGE_PENDING: // Handle segmentation pending state
      return { ...state, loading: true, error: null };

    case FETCH_DOCTOR_PATIENTS_SUCCESS:
      return { ...state, loading: false, patients: action.payload };

    case FETCH_DOCTOR_PATIENT_DETAILS_SUCCESS:
      return { ...state, loading: false, patientDetails: action.payload };

    case SEGMENT_IMAGE_SUCCESS: // Handle segmentation success
      return { ...state, loading: false, segmentedImage: action.payload };

    case FETCH_DOCTOR_PATIENTS_ERROR:
    case FETCH_DOCTOR_PATIENT_DETAILS_ERROR:
    case SEGMENT_IMAGE_ERROR: // Handle segmentation error
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
