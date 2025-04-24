/**
 * @file Redux Saga for handling doctor-patient operations.
 *
 * Manages fetching a doctor's patient list and individual patient details.
 *
 * @namespace store.sagas.doctorPatientsSaga
 * @memberof store.sagas
 */

import { call, put, takeLatest } from "redux-saga/effects";
import {
  FETCH_DOCTOR_PATIENTS,
  FETCH_DOCTOR_PATIENT_DETAILS,
} from "../actions/types";
import {
  fetchDoctorPatients,
  fetchDoctorPatientDetails,
} from "../actions";
import {
  fetchDoctorPatientsApi,
  fetchDoctorPatientDetailsApi,
} from "../apis";

/**
 * Worker saga: Fetches the list of patients associated with a doctor.
 *
 * @generator
 * @function handleFetchDoctorPatients
 * @memberof store.sagas.doctorPatientsSaga
 * @param {Object} action - Redux action object.
 * @param {Object} action.payload - Payload containing the authorization token.
 * @param {string} action.payload.token - Authorization token for API access.
 */
function* handleFetchDoctorPatients(action) {
  try {
    yield put(fetchDoctorPatients.pending());
    const res = yield call(fetchDoctorPatientsApi, action.payload.token);
    yield put(fetchDoctorPatients.success(res.data));
  } catch (err) {
    yield put(fetchDoctorPatients.error(err.message));
  }
}

/**
 * Worker saga: Fetches detailed information about a specific patient.
 *
 * @generator
 * @function handleFetchDoctorPatientDetails
 * @memberof store.sagas.doctorPatientsSaga
 * @param {Object} action - Redux action object.
 * @param {Object} action.payload - Payload containing token and patient ID.
 * @param {string} action.payload.token - Authorization token.
 * @param {string} action.payload.patientId - ID of the patient to fetch.
 */
function* handleFetchDoctorPatientDetails(action) {
  try {
    yield put(fetchDoctorPatientDetails.pending());
    const { token, patientId } = action.payload;
    const res = yield call(fetchDoctorPatientDetailsApi, token, patientId);
    yield put(fetchDoctorPatientDetails.success(res.data));
  } catch (err) {
    yield put(fetchDoctorPatientDetails.error(err.message));
  }
}

/**
 * Watcher saga: Listens for doctor-patient-related actions.
 *
 * @generator
 * @function watchDoctorPatientsSaga
 * @memberof store.sagas.doctorPatientsSaga
 * @yields {Generator} Saga watchers for patient fetch actions.
 */
export default function* watchDoctorPatientsSaga() {
  yield takeLatest(FETCH_DOCTOR_PATIENTS, handleFetchDoctorPatients);
  yield takeLatest(FETCH_DOCTOR_PATIENT_DETAILS, handleFetchDoctorPatientDetails);
}
