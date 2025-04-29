/**
 * @file Redux Saga for handling doctor-patient operations.
 *
 * Manages fetching a doctor's patient list, individual patient details, and image segmentation.
 *
 * @namespace store.sagas.doctorPatientsSaga
 * @memberof store.sagas
 */

import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  FETCH_DOCTOR_PATIENTS,
  FETCH_DOCTOR_PATIENT_DETAILS,
  SEGMENT_IMAGE,
  DELETE_SEGMENTED_IMAGE,
} from "../actions/types";
import {
  fetchDoctorPatients,
  fetchDoctorPatientDetails,
  segmentImage,
  deleteSegmentedImage,
} from "../actions";
import {
  fetchDoctorPatientsApi,
  fetchDoctorPatientDetailsApi,
  medsegApi,
  deleteSegmentedImageApi,
} from "../apis";

/**
 * Worker saga: Fetches the list of patients associated with a doctor.
 *
 * @generator
 * @function handleFetchDoctorPatients
 * @memberof store.sagas.doctorPatientsSaga
 * @param {Object} action - Redux action object.
 * @param {Object} action.payload - Payload containing the authorization token.
 * @param {string} action.payload.token - Authorization token for API access.
 */
function* handleFetchDoctorPatients(action) {
  try {
    yield put(fetchDoctorPatients.pending());
    const res = yield call(fetchDoctorPatientsApi, action.payload.token);
    yield put(fetchDoctorPatients.success(res.data));
  } catch (err) {
    yield put(fetchDoctorPatients.error(err.message));
  }
}

/**
 * Worker saga: Fetches detailed information about a specific patient.
 *
 * @generator
 * @function handleFetchDoctorPatientDetails
 * @memberof store.sagas.doctorPatientsSaga
 * @param {Object} action - Redux action object.
 * @param {Object} action.payload - Payload containing token and patient ID.
 * @param {string} action.payload.token - Authorization token.
 * @param {string} action.payload.patientId - ID of the patient to fetch.
 */
function* handleFetchDoctorPatientDetails(action) {
  try {
    yield put(fetchDoctorPatientDetails.pending());
    const { token, patientId } = action.payload;
    const res = yield call(fetchDoctorPatientDetailsApi, token, patientId);
    yield put(fetchDoctorPatientDetails.success(res.data));
  } catch (err) {
    yield put(fetchDoctorPatientDetails.error(err.message));
  }
}

/**
 * Worker saga: Handles image segmentation requests.
 *
 * @generator
 * @function handleSegmentImage
 * @memberof store.sagas.doctorPatientsSaga
 * @param {Object} action - Redux action object.
 * @param {Object} action.payload - Payload containing image URL or file and patient ID.
 */
function* handleSegmentImage(action) {
  try {
    yield put(segmentImage.pending());
    const res = yield call(medsegApi, action.payload);
    const token = yield select((state) => state.auth?.token);
    yield put(
      fetchDoctorPatientDetails({ token, patientId: action.payload.patientId })
    );
    yield put(segmentImage.success(res.data.s3Url)); // Store segmented image URL
  } catch (err) {
    yield put(segmentImage.error(err.message));
  }
}

function* handleDeleteSegmentedImage(action) {
  try {
    const token = yield select((state) => state.auth?.token);

    yield put(deleteSegmentedImage.pending());
    yield call(deleteSegmentedImageApi, action.payload, token);
    yield put(
      fetchDoctorPatientDetails({ token, patientId: action.payload.patientId })
    );
    yield put(deleteSegmentedImage.success(action.payload.segmentedUrl));
  } catch (err) {
    yield put(deleteSegmentedImage.error(err.message));
  }
}

/**
 * Watcher saga: Listens for doctor-patient-related actions and segmentation actions.
 *
 * @generator
 * @function watchDoctorPatientsSaga
 * @memberof store.sagas.doctorPatientsSaga
 * @yields {Generator} Saga watchers for patient fetch and segmentation actions.
 */
export default function* watchDoctorPatientsSaga() {
  yield takeLatest(DELETE_SEGMENTED_IMAGE, handleDeleteSegmentedImage);

  yield takeLatest(FETCH_DOCTOR_PATIENTS, handleFetchDoctorPatients);
  yield takeLatest(
    FETCH_DOCTOR_PATIENT_DETAILS,
    handleFetchDoctorPatientDetails
  );
  yield takeLatest(SEGMENT_IMAGE, handleSegmentImage);
}
