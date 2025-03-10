/**
 * @file Redux Saga for handling admin-related operations.
 *
 * Manages doctor fetching and verification through API calls.
 *
 * @namespace store.sagas.adminSaga
 * @memberof store.sagas
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { fetchDoctors, verifyDoctor } from "../../store/actions";
import { FETCH_DOCTORS, VERIFY_DOCTOR } from "../actions/types";
import { fetchDoctorsApi, verifyDoctorApi } from "../apis";

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
