/**
 * @fileoverview Redux-Saga for handling dashboard-related API calls.
 * Manages fetching dashboard data securely using an authorization token.
 */

import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { fetchDashboard } from "../actions";
import { FETCH_DASHBOARD } from "../actions/types";

/**
 * API request to fetch dashboard data.
 * @function
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves with the dashboard data.
 */
const fetchDashboardApi = (token) =>
  axios.get("http://localhost:5000/api/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

/**
 * Worker saga: Handles fetching dashboard data.
 * @generator
 * @function handleFetchDashboard
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
 * @yields {Generator} Watches for FETCH_DASHBOARD actions.
 */
export default function* watchDashboardSaga() {
  yield takeLatest(FETCH_DASHBOARD, handleFetchDashboard);
}
