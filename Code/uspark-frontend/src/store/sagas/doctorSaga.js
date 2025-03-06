/**
 * @fileoverview Redux-Saga for handling doctor verification document uploads.
 * Manages secure file uploads and refreshes the dashboard upon success.
 */

import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { fetchDashboard, uploadVerificationDocs } from "../actions";
import { UPLOAD_VERIFICATION_DOCS } from "../actions/types";

/**
 * Base API URL for doctor-related verification actions.
 * @constant {string}
 */
const API_URL = "http://localhost:5000/api/dashboard/doctor";

/**
 * API request to upload verification documents.
 * @function
 * @param {string} token - The authentication token for API authorization.
 * @param {FormData} formData - The form data containing the verification documents.
 * @returns {Promise<Object>} Resolves when the upload is successful.
 */
const uploadDocsApi = (token, formData) =>
  axios.post(`${API_URL}/verify`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

/**
 * Worker saga: Handles uploading verification documents.
 * Dispatches success or error actions and refreshes the dashboard upon success.
 *
 * @generator
 * @function handleUploadVerificationDocs
 * @param {Object} action - Redux action object.
 * @param {Object} action.payload - The payload containing authentication details and form data.
 * @param {string} action.payload.token - The authentication token.
 * @param {FormData} action.payload.formData - The form data containing verification documents.
 * @yields {Generator} Saga effects for uploading documents and updating the dashboard.
 */
function* handleUploadVerificationDocs(action) {
  try {
    yield put(uploadVerificationDocs.pending());
    yield call(uploadDocsApi, action.payload.token, action.payload.formData);
    yield put(uploadVerificationDocs.success());

    // Refresh the dashboard after successful upload
    yield put(fetchDashboard({ token: action.payload.token }));
  } catch (error) {
    yield put(uploadVerificationDocs.error(error.message));
  }
}

/**
 * Watcher saga: Listens for document upload actions.
 * Triggers the worker saga when an upload action is dispatched.
 *
 * @generator
 * @function doctorSaga
 * @yields {Generator} Watches for UPLOAD_VERIFICATION_DOCS actions.
 */
export default function* doctorSaga() {
  yield takeLatest(UPLOAD_VERIFICATION_DOCS, handleUploadVerificationDocs);
}
