import { call, put, takeLatest } from "redux-saga/effects";
import { fetchAssessmentsApi, deleteAssessmentApi } from "../apis";
import { fetchAssessments, deleteAssessment } from "../actions";
import { FETCH_ASSESSMENTS, DELETE_ASSESSMENT } from "../actions/types";

function* fetchAssessmentsSaga() {
  try {
    yield put(fetchAssessments.pending());
    const response = yield call(
      fetchAssessmentsApi,
      localStorage.getItem("token")
    );
    yield put(fetchAssessments.success(response.data));
  } catch (error) {
    yield put(fetchAssessments.error(error.message));
  }
}

function* deleteAssessmentSaga(action) {
  try {
    yield put(deleteAssessment.pending());
    yield call(
      deleteAssessmentApi,
      localStorage.getItem("token"),
      action.payload
    );
    yield put(deleteAssessment.success(action.payload));
  } catch (error) {
    yield put(deleteAssessment.error(error.message));
  }
}

function* watchAssessmentActions() {
  yield takeLatest(FETCH_ASSESSMENTS, fetchAssessmentsSaga);
  yield takeLatest(DELETE_ASSESSMENT, deleteAssessmentSaga);
}

export default watchAssessmentActions;
