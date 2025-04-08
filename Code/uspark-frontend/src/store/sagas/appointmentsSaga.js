/**
 * @file Redux Saga for handling appointment-related operations.
 *
 * Manages appointment creation, updates, deletions, and fetching doctors/hospitals data via API.
 *
 * @namespace store.sagas.appointmentsSaga
 * @memberof store.sagas
 */

import {
  FETCH_APPOINTMENTS,
  FETCH_HOSPITALS,
  FETCH_DOCTORS,
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT,
  DELETE_APPOINTMENT,
} from "../actions/types";
import {
  fetchAppointments,
  fetchHospitals,
  createAppointment,
  fetchDoctors,
} from "../actions";
import {
  fetchAppointmentsApi,
  fetchHospitalsApi,
  createAppointmentApi,
  updateAppointmentApi,
  deleteAppointmentApi,
  fetchDoctorsApi,
} from "../apis";
import { call, put, takeLatest } from "redux-saga/effects";

/**
 * Worker saga: Handles fetching patient appointments.
 *
 * @generator
 * @function handleFetchAppointments
 * @param {Object} action - Redux action containing the token.
 * @yields {Generator} Saga effects for fetching appointments.
 */
function* handleFetchAppointments(action) {
  try {
    yield put(fetchAppointments.pending());
    const response = yield call(fetchAppointmentsApi, action.payload.token);
    yield put(fetchAppointments.success(response.data));
  } catch (error) {
    yield put(fetchAppointments.error(error.message));
  }
}

/**
 * Worker saga: Handles fetching available doctors.
 *
 * @generator
 * @function handleFetchDoctors
 * @param {Object} action - Redux action containing the token.
 * @yields {Generator} Saga effects for fetching doctor data.
 */
function* handleFetchDoctors(action) {
  try {
    yield put(fetchDoctors.pending());
    const response = yield call(fetchDoctorsApi, action.payload.token);
    yield put(fetchDoctors.success(response.data));
  } catch (error) {
    yield put(fetchDoctors.error("Failed to fetch doctors."));
  }
}

/**
 * Worker saga: Handles fetching nearby hospitals.
 *
 * @generator
 * @function handleFetchHospitals
 * @param {Object} action - Redux action containing latitude and longitude.
 * @yields {Generator} Saga effects for fetching hospital data.
 */
function* handleFetchHospitals(action) {
  try {
    yield put(fetchHospitals.pending());
    const { lat, long } = action.payload;
    const response = yield call(fetchHospitalsApi, lat, long);
    yield put(fetchHospitals.success(response.data.results));
  } catch (error) {
    yield put(fetchHospitals.error("Failed to fetch hospitals."));
  }
}

/**
 * Worker saga: Handles appointment creation.
 *
 * @generator
 * @function handleCreateAppointment
 * @param {Object} action - Redux action containing payload and token.
 * @yields {Generator} Saga effects for creating an appointment.
 */
function* handleCreateAppointment(action) {
  try {
    yield put(createAppointment.pending());
    const { token, ...payload } = action.payload;
    const response = yield call(createAppointmentApi, payload, token);
    yield put(createAppointment.success(response.data));
    yield put(fetchAppointments({ token }));
  } catch (error) {
    yield put(createAppointment.error("Failed to create appointment."));
  }
}

/**
 * Worker saga: Handles appointment update.
 *
 * @generator
 * @function handleUpdateAppointment
 * @param {Object} action - Redux action containing ID, token, and updated payload.
 * @yields {Generator} Saga effects for updating the appointment.
 */
function* handleUpdateAppointment(action) {
  try {
    const { id, token, ...payload } = action.payload;
    yield call(updateAppointmentApi, id, payload, token);
    yield put(fetchAppointments({ token }));
  } catch (error) {
    console.error("Update appointment error:", error);
  }
}

/**
 * Worker saga: Handles appointment deletion.
 *
 * @generator
 * @function handleDeleteAppointment
 * @param {Object} action - Redux action containing ID and token.
 * @yields {Generator} Saga effects for deleting the appointment.
 */
function* handleDeleteAppointment(action) {
  try {
    const { id, token } = action.payload;
    yield call(deleteAppointmentApi, id, token);
    yield put(fetchAppointments({ token }));
  } catch (error) {
    console.error("Delete appointment error:", error);
  }
}

/**
 * Watcher saga: Listens for appointment-related actions and triggers worker sagas.
 *
 * @generator
 * @function watchAppointmentsSaga
 * @memberof store.sagas.appointmentsSaga
 * @yields {Generator} Saga watchers for fetching, creating, updating, and deleting appointments.
 */
export default function* watchAppointmentsSaga() {
  yield takeLatest(FETCH_APPOINTMENTS, handleFetchAppointments);
  yield takeLatest(FETCH_HOSPITALS, handleFetchHospitals);
  yield takeLatest(CREATE_APPOINTMENT, handleCreateAppointment);
  yield takeLatest(UPDATE_APPOINTMENT, handleUpdateAppointment);
  yield takeLatest(DELETE_APPOINTMENT, handleDeleteAppointment);
  yield takeLatest(FETCH_DOCTORS, handleFetchDoctors);
}
