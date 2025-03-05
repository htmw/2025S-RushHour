import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { fetchDoctors, verifyDoctor } from "../../store/actions";
import { FETCH_DOCTORS, VERIFY_DOCTOR } from "../actions/types";

const API_URL = "http://localhost:5000/api/admin";

// ✅ API call to fetch doctors
const fetchDoctorsApi = () => axios.get(`${API_URL}/doctors`);

// ✅ API call to verify doctor
const verifyDoctorApi = (doctorId, decision) =>
  axios.post(`${API_URL}/verify-doctor/${doctorId}`, { decision });

// ✅ Worker Saga: Fetch Doctors
function* handleFetchDoctors() {
  try {
    yield put(fetchDoctors.pending());
    const response = yield call(fetchDoctorsApi);
    yield put(fetchDoctors.success(response.data));
  } catch (error) {
    yield put(fetchDoctors.error(error.message));
  }
}

// ✅ Worker Saga: Verify Doctor
function* handleVerifyDoctor(action) {
  try {
    yield put(verifyDoctor.pending());
    yield call(
      verifyDoctorApi,
      action.payload.doctorId,
      action.payload.decision
    );
    yield put(verifyDoctor.success(action.payload));
    yield put(fetchDoctors()); // Refresh doctors list
  } catch (error) {
    yield put(verifyDoctor.error(error.message));
  }
}

// ✅ Watcher Saga
export default function* watchAdminSaga() {
  yield takeLatest(FETCH_DOCTORS, handleFetchDoctors);
  yield takeLatest(VERIFY_DOCTOR, handleVerifyDoctor);
}
