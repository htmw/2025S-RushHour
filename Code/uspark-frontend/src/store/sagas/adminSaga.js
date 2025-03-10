/**
 * @file Redux Saga for handling admin-related operations.
 *
 * Manages doctor fetching and verification through API calls.
 *
 * @namespace store.sagas.adminSaga
 * @memberof store.sagas
 */

import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { fetchDoctors, verifyDoctor } from "../../store/actions";
import { FETCH_DOCTORS, VERIFY_DOCTOR } from "../actions/types";

/**
 * Base API URL for admin-related operations.
 *
 * @constant
 * @memberof store.sagas.adminSaga
 * @type {string}
 */
const API_URL = "http://localhost:5001/api/admin";

/**
 * API call to fetch doctors.
 *
 * @function
 * @memberof store.sagas.adminSaga
 * @returns {Promise<Object>} Resolves with the list of doctors.
 */
const fetchDoctorsApi = () => axios.get(`${API_URL}/doctors`);

/**
 * API call to verify a doctor's status.
 *
 * @function
 * @memberof store.sagas.adminSaga
 * @param {string} doctorId - The unique identifier of the doctor.
 * @param {string} decision - The verification decision (e.g., "approved" or "rejected").
 * @returns {Promise<Object>} Resolves with the verification response.
 */
const verifyDoctorApi = (doctorId, decision) =>
  axios.post(`${API_URL}/verify-doctor/${doctorId}`, { decision });

/**
 * Worker saga: Handles fetching doctors from the API.
 *
 * @generator
 * @function handleFetchDoctors
 * @memberof store.sagas.adminSaga
 * @yields {Generator} Saga effects for fetching doctor data.
 */
function* handleFetchDoctors() {
  try {
    yield put(fetchDoctors.pending());
    const response = yield call(fetchDoctorsApi);
    yield put(fetchDoctors.success(response.data));
  } catch (error) {
    yield put(fetchDoctors.error(error.message));
  }
}

/**
 * Worker saga: Handles doctor verification requests.
 *
 * @generator
 * @function handleVerifyDoctor
 * @memberof store.sagas.adminSaga
 * @param {Object} action - Redux action object.
 * @param {Object} action.payload - Action payload containing doctorId and decision.
 * @param {string} action.payload.doctorId - The unique ID of the doctor to verify.
 * @param {string} action.payload.decision - The verification decision ("approved" or "rejected").
 * @yields {Generator} Saga effects for doctor verification.
 */
function* handleVerifyDoctor(action) {
  try {
    yield put(verifyDoctor.pending());
    yield call(
      verifyDoctorApi,
      action.payload.doctorId,
      action.payload.decision
    );
    yield put(verifyDoctor.success(action.payload));
    yield put(fetchDoctors()); // Refresh the doctors list
  } catch (error) {
    yield put(verifyDoctor.error(error.message));
  }
}

/**
 * Watcher saga: Listens for admin-related actions.
 * Triggers worker sagas when corresponding actions are dispatched.
 *
 * @generator
 * @function watchAdminSaga
 * @memberof store.sagas.adminSaga
 * @yields {Generator} Watches for FETCH_DOCTORS and VERIFY_DOCTOR actions.
 */
export default function* watchAdminSaga() {
  yield takeLatest(FETCH_DOCTORS, handleFetchDoctors);
  yield takeLatest(VERIFY_DOCTOR, handleVerifyDoctor);
}
