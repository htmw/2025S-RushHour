import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { fetchDashboard } from "../actions";
import { FETCH_DASHBOARD } from "../actions/types";

// ✅ API Call to Fetch Dashboard Data
const fetchDashboardApi = (token) =>
  axios.get("http://localhost:5000/api/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

// ✅ Worker Saga: Fetch Dashboard Data
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

// ✅ Watcher Saga
export default function* watchDashboardSaga() {
  yield takeLatest(FETCH_DASHBOARD, handleFetchDashboard);
}
