/**
 * @file Redux Saga for managing medical history-related operations.
 *
 * Handles creating and fetching a patient's medical history using API calls.
 *
 * @namespace store.sagas.medicalHistorySaga
 * @memberof store.sagas
 */

import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  CREATE_MEDICAL_HISTORY,
  FETCH_MEDICAL_HISTORY,
} from "../actions/types";
import {
  createMedicalHistory,
  fetchMedicalHistory,
  fetchDashboard,
} from "../actions";
import { createMedicalHistoryApi, fetchMedicalHistoryApi } from "../apis";
import { enqueueSnackbar } from "notistack";

/**
 * Worker saga: Handles creation of medical history records.
 *
 * @generator
 * @function handleCreateMedicalHistory
 * @memberof store.sagas.medicalHistorySaga
 * @param {Object} action - Redux action containing payload for new medical history entry.
 * @param {Object} action.payload - Medical history data to save.
 * @yields {Generator} Saga effects to create and notify on success or failure.
 */
function* handleCreateMedicalHistory(action) {
  try {
    yield put(createMedicalHistory.pending());
    const token = yield select((state) => state.auth?.token);
    yield call(createMedicalHistoryApi, token, action.payload);
    yield put(createMedicalHistory.success());
    enqueueSnackbar("Medical history saved!", { variant: "success" });
    yield put(fetchMedicalHistory());
    yield put(fetchDashboard({ token }));
  } catch (error) {
    const msg =
      error.response?.data?.message || "Failed to save medical history";
    yield put(createMedicalHistory.error(msg));
    enqueueSnackbar(msg, { variant: "error" });
  }
}

/**
 * Worker saga: Fetches a patient's medical history.
 *
 * @generator
 * @function handleFetchMedicalHistory
 * @memberof store.sagas.medicalHistorySaga
 * @yields {Generator} Saga effects to fetch medical history records.
 */
function* handleFetchMedicalHistory() {
  try {
    yield put(fetchMedicalHistory.pending());
    const token = yield select((state) => state.auth?.token);
    const response = yield call(fetchMedicalHistoryApi, token);
    yield put(fetchMedicalHistory.success(response.data));
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch medical history";
    yield put(fetchMedicalHistory.error(message));
  }
}

/**
 * Watcher saga: Listens for medical history-related actions.
 *
 * @generator
 * @function watchMedicalHistorySaga
 * @memberof store.sagas.medicalHistorySaga
 * @yields {Generator} Watches for CREATE_MEDICAL_HISTORY and FETCH_MEDICAL_HISTORY actions.
 */
export default function* watchMedicalHistorySaga() {
  yield takeLatest(FETCH_MEDICAL_HISTORY, handleFetchMedicalHistory);
  yield takeLatest(CREATE_MEDICAL_HISTORY, handleCreateMedicalHistory);
}
