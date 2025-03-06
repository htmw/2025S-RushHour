/**
 * @fileoverview Redux-Saga for handling doctor and patient onboarding.
 * Manages onboarding API calls, updates Redux state, and provides user feedback.
 */

import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { doctorOnboarding, login, patientOnboarding } from "../actions";
import { enqueueSnackbar } from "notistack";
import { DOCTOR_ONBOARDING, PATIENT_ONBOARDING } from "../actions/types";
import history from "../../history";

/**
 * API request to onboard a doctor.
 * @function
 * @param {FormData} formData - The form data containing onboarding details.
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves when the onboarding request is successful.
 */
const doctorOnboardingApi = (formData, token) =>
  axios.post("http://localhost:5000/api/onboarding/doctor", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * API request to onboard a patient.
 * @function
 * @param {FormData} formData - The form data containing onboarding details.
 * @param {string} token - The authentication token for API authorization.
 * @returns {Promise<Object>} Resolves when the onboarding request is successful.
 */
const patientOnboardingApi = (formData, token) =>
  axios.post("http://localhost:5000/api/onboarding/patient", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * Worker saga: Handles doctor onboarding.
 * Dispatches success or error actions and navigates to the dashboard upon completion.
 *
 * @generator
 * @function handleDoctorOnboarding
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
 * Watcher saga: Listens for onboarding actions.
 * Triggers the worker saga when an onboarding action is dispatched.
 *
 * @generator
 * @function watchPatientOnboardingSaga
 * @yields {Generator} Watches for DOCTOR_ONBOARDING and PATIENT_ONBOARDING actions.
 */
export default function* watchPatientOnboardingSaga() {
  yield takeLatest(PATIENT_ONBOARDING, handlePatientOnboarding);
  yield takeLatest(DOCTOR_ONBOARDING, handleDoctorOnboarding);
}
