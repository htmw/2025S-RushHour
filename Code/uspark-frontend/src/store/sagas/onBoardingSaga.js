/**
 * @file Redux-Saga for handling doctor and patient onboarding.
 *
 * Manages onboarding API calls, updates Redux state, and provides user feedback.
 *
 * @namespace store.sagas.onBoardingSaga
 * @memberof store.sagas
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { doctorOnboarding, fetchDashboard, login, patientOnboarding, uploadVerificationDocs } from "../actions";
import { enqueueSnackbar } from "notistack";
import { DOCTOR_ONBOARDING, PATIENT_ONBOARDING, UPLOAD_VERIFICATION_DOCS } from "../actions/types";
import history from "../../history";
import { doctorOnboardingApi, patientOnboardingApi, uploadDocsApi } from "../apis";

/**
 * Worker saga: Handles doctor onboarding.
 * Dispatches success or error actions and navigates to the dashboard upon completion.
 *
 * @generator
 * @function handleDoctorOnboarding
 * @memberof store.sagas.onBoardingSaga
 * @param {Object} action - Redux action object.
 * @param {Object} action.payload - The payload containing form data and authentication token.
 * @param {FormData} action.payload.formData - The doctor's onboarding details.
 * @param {string} action.payload.token - The authentication token.
 * @yields {Generator} Saga effects for onboarding and navigation.
 */
function* handleDoctorOnboarding(action) {
  const { navigate } = action.meta || {};

  try {
    yield put(doctorOnboarding.pending());

    const { formData, token } = action.payload;
    yield call(doctorOnboardingApi, formData, token);

    yield put(doctorOnboarding.success(formData));
    enqueueSnackbar("Doctor Onboarding Completed!", { variant: "success" });
    yield put(
      login.success({
        isOnboarded: true,
      })
    );
    history.push("/dashboard");
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Onboarding Failed";
    yield put(doctorOnboarding.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

/**
 * Worker saga: Handles patient onboarding.
 * Dispatches success or error actions and navigates to the dashboard upon completion.
 *
 * @generator
 * @function handlePatientOnboarding
 * @memberof store.sagas.onBoardingSaga
 * @param {Object} action - Redux action object.
 * @param {Object} action.payload - The payload containing form data and authentication token.
 * @param {FormData} action.payload.formData - The patient's onboarding details.
 * @param {string} action.payload.token - The authentication token.
 * @yields {Generator} Saga effects for onboarding and navigation.
 */
function* handlePatientOnboarding(action) {
  const { navigate } = action.meta || {};

  try {
    yield put(patientOnboarding.pending());

    const { formData, token } = action.payload;
    yield call(patientOnboardingApi, formData, token);

    yield put(patientOnboarding.success(formData));
    yield put(
      login.success({
        isOnboarded: true,
      })
    );
    enqueueSnackbar("Patient Onboarding Completed!", { variant: "success" });

    history.push("/dashboard");
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Onboarding Failed";
    yield put(patientOnboarding.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

/**
 * Worker saga: Handles uploading verification documents.
 * Dispatches success or error actions and refreshes the dashboard upon success.
 *
 * @generator
 * @function handleUploadVerificationDocs
 * @memberof store.sagas.onBoardingSaga
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
 * Watcher saga: Listens for onboarding actions.
 * Triggers the worker saga when an onboarding action is dispatched.
 *
 * @generator
 * @function watchOnBoardingSaga
 * @memberof store.sagas.onBoardingSaga
 * @yields {Generator} Watches for DOCTOR_ONBOARDING and PATIENT_ONBOARDING actions.
 */
export default function* watchOnBoardingSaga() {
  yield takeLatest(PATIENT_ONBOARDING, handlePatientOnboarding);
  yield takeLatest(DOCTOR_ONBOARDING, handleDoctorOnboarding);
  yield takeLatest(UPLOAD_VERIFICATION_DOCS, handleUploadVerificationDocs);

}
