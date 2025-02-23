import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { doctorOnboarding, patientOnboarding } from "../actions";
import { enqueueSnackbar } from "notistack";
import { DOCTOR_ONBOARDING, PATIENT_ONBOARDING } from "../actions/types";
import history from "../../history";

const doctorOnboardingApi = (formData, token) =>
  axios.post("http://localhost:5000/api/onboarding/doctor", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const patientOnboardingApi = (formData, token) =>
  axios.post("http://localhost:5000/api/onboarding/patient", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

function* handleDoctorOnboarding(action) {
  const { navigate } = action.meta || {};

  try {
    yield put(doctorOnboarding.pending());

    const { formData, token } = action.payload;
    yield call(doctorOnboardingApi, formData, token);

    yield put(doctorOnboarding.success(formData));
    enqueueSnackbar("Doctor Onboarding Completed!", { variant: "success" });
    history.push("/dashboard");
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Onboarding Failed";
    yield put(doctorOnboarding.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

function* handlePatientOnboarding(action) {
  const { navigate } = action.meta || {};

  try {
    yield put(patientOnboarding.pending());

    const { formData, token } = action.payload;
    yield call(patientOnboardingApi, formData, token);

    yield put(patientOnboarding.success(formData));
    enqueueSnackbar("Patient Onboarding Completed!", { variant: "success" });
    history.push("/dashboard");
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Onboarding Failed";
    yield put(patientOnboarding.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

export default function* watchPatientOnboardingSaga() {
  yield takeLatest(PATIENT_ONBOARDING, handlePatientOnboarding);
  yield takeLatest(DOCTOR_ONBOARDING, handleDoctorOnboarding);
}
