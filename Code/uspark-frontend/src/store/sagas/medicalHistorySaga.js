import { call, put, takeLatest, select } from "redux-saga/effects";
import { CREATE_MEDICAL_HISTORY, FETCH_MEDICAL_HISTORY } from "../actions/types";
import { createMedicalHistory, fetchMedicalHistory } from "../actions";
import { createMedicalHistoryApi, fetchMedicalHistoryApi } from "../apis";
import { enqueueSnackbar } from "notistack";

function* handleCreateMedicalHistory(action) {
    try {
        yield put(createMedicalHistory.pending());
        const token = yield select((state) => state.auth?.token);
        yield call(createMedicalHistoryApi, token, action.payload);
        yield put(createMedicalHistory.success());
        enqueueSnackbar("Medical history saved!", { variant: "success" });
        yield put(fetchMedicalHistory());
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to save medical history";
        yield put(createMedicalHistory.error(msg));
        enqueueSnackbar(msg, { variant: "error" });
    }
}

function* handleFetchMedicalHistory() {
    try {
        yield put(fetchMedicalHistory.pending());
        const token = yield select((state) => state.auth?.token);
        const response = yield call(fetchMedicalHistoryApi, token);
        yield put(fetchMedicalHistory.success(response.data));
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch medical history";
        yield put(fetchMedicalHistory.error(message));
    }
}

export default function* watchMedicalHistorySaga() {
    yield takeLatest(FETCH_MEDICAL_HISTORY, handleFetchMedicalHistory);

    yield takeLatest(CREATE_MEDICAL_HISTORY, handleCreateMedicalHistory);
}
