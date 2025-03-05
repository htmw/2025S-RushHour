import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { fetchDashboard, uploadVerificationDocs } from "../actions";
import { UPLOAD_VERIFICATION_DOCS } from "../actions/types";

const API_URL = "http://localhost:5000/api/dashboard/doctor";

// ✅ API call to upload verification documents
const uploadDocsApi = (token, formData) =>
  axios.post(`${API_URL}/verify`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

// ✅ Worker Saga: Upload Verification Documents
function* handleUploadVerificationDocs(action) {
  try {
    yield put(uploadVerificationDocs.pending());
    yield call(uploadDocsApi, action.payload.token, action.payload.formData);
    yield put(uploadVerificationDocs.success());
    yield put(fetchDashboard({ token: action.payload.token })); // Refresh dashboard
  } catch (error) {
    yield put(uploadVerificationDocs.error(error.message));
  }
}

// ✅ Watcher Saga
export default function* doctorSaga() {
  yield takeLatest(UPLOAD_VERIFICATION_DOCS, handleUploadVerificationDocs);
}
