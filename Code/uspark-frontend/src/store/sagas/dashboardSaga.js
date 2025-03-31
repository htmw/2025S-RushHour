/**
 * @file Redux-Saga for handling dashboard-related API calls.
 *
 * Manages fetching dashboard data securely using an authorization token.
 *
 * @namespace store.sagas.dashboardSaga
 * @memberof store.sagas
 */

import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  fetchDashboard,
  updateDoctorProfile,
  updatePatientProfile,
} from "../actions";
import {
  FETCH_DASHBOARD,
  UPDATE_DOCTOR_PROFILE,
  UPDATE_PATIENT_PROFILE,
} from "../actions/types";
import {
  fetchDashboardApi,
  updateDoctorProfileApi,
  updatePatientProfileApi,
} from "../apis";
import { enqueueSnackbar } from "notistack";

/**
 * Worker saga: Handles fetching dashboard data.
 *
 * @generator
 * @function handleFetchDashboard
 * @memberof store.sagas.dashboardSaga
 * @param {Object} action - Redux action object containing the authentication token.
 * @param {Object} action.payload - The payload object.
 * @param {string} action.payload.token - The authentication token.
 * @yields {Generator} Saga effects for API call and state updates.
 */
function* handleFetchDashboard(action) {
  try {
    yield put(fetchDashboard.pending());

    const response = yield call(fetchDashboardApi, action.payload.token);
    yield put(fetchDashboard.success(response.data));
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Failed to fetch data";
    yield put(fetchDashboard.error(errorMsg));
  }
}

/**
 * Worker saga: Handles updating patient profile information.
 * Dispatches pending, success, or error actions accordingly.
 *
 * @generator
 * @function handleUpdatePatientProfile
 * @memberof store.sagas.dashboardSaga
 * @param {Object} action - Redux action containing payload.

 * @param {Object} action.payload - The payload containing profile data and authentication token.
 * @param {string} action.payload.token - The authentication token.
 * @yields {Generator} Saga effects for API call and state updates.
 */

function* handleUpdatePatientProfile(action) {
  try {
    yield put(updatePatientProfile.pending());

    const { token, ...profileData } = action.payload;
    const response = yield call(updatePatientProfileApi, token, profileData);

    yield put(updatePatientProfile.success(response.data.patient));
    enqueueSnackbar("Patient profile updated!", { variant: "success" });
  } catch (error) {
    yield put(updatePatientProfile.error(error.message));
  }
}

/**
 * Worker saga: Handles updating doctor profile information.
 * Dispatches pending, success, or error actions accordingly.
 *
 * @generator
 * @function handleUpdateDoctorProfile
 * @memberof store.sagas.dashboardSaga
 * @param {Object} action - Redux action containing payload.
 * @param {Object} action.payload - The payload containing doctor profile data.
 * @yields {Generator} Saga effects for API call and state updates.
 */

function* handleUpdateDoctorProfile(action) {
  try {
    const token = yield select((state) => state.auth.token);

    yield put(updateDoctorProfile.pending());
    const response = yield call(updateDoctorProfileApi, token, action.payload);

    yield put(updateDoctorProfile.success(response.data));
    enqueueSnackbar("Doctor profile updated!", { variant: "success" });
  } catch (error) {
    console.log({ error });

    enqueueSnackbar("Failed to update doctor profile", { variant: "error" });
    yield put(updateDoctorProfile.error(error.message));
  }
}

/**
 * Watcher saga: Listens for the FETCH_DASHBOARD action.
 * Triggers the worker saga to fetch dashboard data.
 *
 * @generator
 * @function watchDashboardSaga
 * @memberof store.sagas.dashboardSaga
 * @yields {Generator} Watches for FETCH_DASHBOARD actions.
 */
export default function* watchDashboardSaga() {
  yield takeLatest(FETCH_DASHBOARD, handleFetchDashboard);
  yield takeLatest(UPDATE_PATIENT_PROFILE, handleUpdatePatientProfile);
  yield takeLatest(UPDATE_DOCTOR_PROFILE, handleUpdateDoctorProfile);
}
