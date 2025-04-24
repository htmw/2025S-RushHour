/**
 * @file Redux Saga for handling admin-related operations.
 *
 * Manages doctor fetching and verification through API calls.
 *
 * @namespace store.sagas.adminSaga
 * @memberof store.sagas
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { adminDoctor, verifyDoctor } from "../../store/actions";
import { ADMIN_DOCTOR_API, VERIFY_DOCTOR } from "../actions/types";
import { adminDoctorApi, verifyDoctorApi } from "../apis";

function* handleFetchDoctors() {
  try {
    yield put(adminDoctor.pending());
    const response = yield call(adminDoctorApi);
    yield put(adminDoctor.success(response.data));
  } catch (error) {
    yield put(adminDoctor.error(error.message));
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
    yield put(adminDoctor()); // Refresh the doctors list
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
  yield takeLatest(ADMIN_DOCTOR_API, handleFetchDoctors);
  yield takeLatest(VERIFY_DOCTOR, handleVerifyDoctor);
}
