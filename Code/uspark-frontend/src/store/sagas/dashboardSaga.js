/**
 * @file Redux-Saga for handling dashboard-related API calls.
 *
 * Manages fetching dashboard data securely using an authorization token.
 *
 * @namespace store.sagas.dashboardSaga
 * @memberof store.sagas
 */

import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchDashboard,
} from "../actions";
import {
  FETCH_DASHBOARD,
} from "../actions/types";
import {
  fetchDashboardApi,
} from "../apis";

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
}
