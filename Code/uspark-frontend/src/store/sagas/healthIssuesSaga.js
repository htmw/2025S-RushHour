import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_HEALTH_ISSUES, ADD_HEALTH_ISSUE } from "../actions/types";
import { fetchHealthIssues, addHealthIssue, fetchDashboard } from "../actions";
import { addHealthIssuesApi, fetchHealthIssuesApi } from "../apis";

/**
 *
 * @function fetchHealthIssuesSaga
 * @description Fetches health issues from the API.
 * @param {Object} action - The Redux action object.
 * @returns {Generator} A generator that handles the API call and dispatches the success or error action.
 *
 */
function* fetchHealthIssuesSaga(action) {
  try {
    const { query, token } = action.payload;
    console.log({ query, token });
    const response = yield call(fetchHealthIssuesApi, query, token);
    console.log({ response });
    yield put(fetchHealthIssues.success(response));
  } catch (error) {
    yield put(
      fetchHealthIssues.error(
        error.response?.data?.message || "Failed to fetch health issues"
      )
    );
  }
}

/**
 *
 * @function addHealthIssueSaga
 * @description Adds a new health issue to the API.
 * @param {Object} action - The Redux action object.
 * @returns {Generator} A generator that handles the API call and dispatches the success or error action.
 *
 */
function* addHealthIssueSaga(action) {
  try {
    const { health_issue, token } = action.payload;
    const response = yield call(addHealthIssuesApi, { health_issue }, token);
    yield put(addHealthIssue.success(response.data));
    yield put(fetchDashboard({ token }));
  } catch (error) {
    yield put(
      addHealthIssue.error(
        error.response?.data?.message || "Failed to add health issue"
      )
    );
  }
}

export default function* watchHealthIssuesSaga() {
  yield takeLatest(FETCH_HEALTH_ISSUES, fetchHealthIssuesSaga);
  yield takeLatest(ADD_HEALTH_ISSUE, addHealthIssueSaga);
}
