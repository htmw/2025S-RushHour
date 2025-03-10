/**
 * @file Redux-Saga for handling doctor verification document uploads.
 *
 * Manages secure file uploads and refreshes the dashboard upon success.
 *
 * @namespace store.sagas.doctorSaga
 * @memberof store.sagas
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { fetchDashboard, uploadVerificationDocs } from "../actions";
import { UPLOAD_VERIFICATION_DOCS } from "../actions/types";
import { uploadDocsApi } from "../apis";

/**
 * Worker saga: Handles uploading verification documents.
 * Dispatches success or error actions and refreshes the dashboard upon success.
 *
 * @generator
 * @function handleUploadVerificationDocs
 * @memberof store.sagas.doctorSaga
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
 * @function watchDoctorSaga
 * @memberof store.sagas.doctorSaga
 * @yields {Generator} Watches for UPLOAD_VERIFICATION_DOCS actions.
 */
export default function* watchDoctorSaga() {
  yield takeLatest(UPLOAD_VERIFICATION_DOCS, handleUploadVerificationDocs);
}
