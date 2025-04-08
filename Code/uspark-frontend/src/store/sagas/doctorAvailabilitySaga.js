/**
 * @file Redux Saga for handling doctor availability operations.
 *
 * Manages fetching, saving, and updating doctor availability slots via API.
 *
 * @namespace store.sagas.doctorAvailabilitySagas
 * @memberof store.sagas
 */

import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchDoctorAvailabilityApi,
  saveDoctorAvailabilityApi,
  updateDoctorAvailabilityApi,
} from "../apis";

import {
  fetchDoctorAvailability,
  saveDoctorAvailability,
  updateDoctorAvailability,
} from "../actions";

import {
  FETCH_DOCTOR_AVAILABILITY,
  SAVE_DOCTOR_AVAILABILITY,
  UPDATE_DOCTOR_AVAILABILITY,
} from "../actions/types";

/**
 * Worker saga: Handles fetching doctor availability slots.
 *
 * @generator
 * @function fetchDoctorAvailabilitySaga
 * @param {Object} action - Redux action with payload and meta.
 * @param {string} action.payload - Token used for authorization.
 * @param {Object} [action.meta] - Optional metadata for navigation.
 */
function* fetchDoctorAvailabilitySaga({ payload, meta }) {
  try {
    yield put(fetchDoctorAvailability.pending(meta?.navigate));
    const response = yield call(fetchDoctorAvailabilityApi, payload);
    yield put(
      fetchDoctorAvailability.success(response.data.availability, meta?.navigate)
    );
  } catch (error) {
    yield put(fetchDoctorAvailability.error(error.message, meta?.navigate));
  }
}

/**
 * Worker saga: Handles saving new availability slots for the doctor.
 *
 * @generator
 * @function saveDoctorAvailabilitySaga
 * @param {Object} action - Redux action with payload and meta.
 * @param {Object} action.payload - Contains token and availability slots.
 * @param {string} action.payload.token - Authorization token.
 * @param {Array<Object>} action.payload.slots - Array of slot objects.
 * @param {Object} [action.meta] - Optional metadata for navigation.
 */
function* saveDoctorAvailabilitySaga({ payload, meta }) {
  try {
    yield put(saveDoctorAvailability.pending(meta?.navigate));
    const { token, slots } = payload;
    const response = yield call(saveDoctorAvailabilityApi, token, slots);
    yield put(
      saveDoctorAvailability.success(response.data.availability, meta?.navigate)
    );
  } catch (error) {
    yield put(saveDoctorAvailability.error(error.message, meta?.navigate));
  }
}

/**
 * Worker saga: Handles updating a specific availability slot.
 *
 * @generator
 * @function updateDoctorAvailabilitySaga
 * @param {Object} action - Redux action with payload and meta.
 * @param {Object} action.payload - Contains token and the updated slot.
 * @param {string} action.payload.token - Authorization token.
 * @param {Object} action.payload.slot - Updated slot object.
 * @param {Object} [action.meta] - Optional metadata for navigation.
 */
function* updateDoctorAvailabilitySaga({ payload, meta }) {
  try {
    yield put(updateDoctorAvailability.pending(meta?.navigate));
    const { token, slot } = payload;
    const response = yield call(updateDoctorAvailabilityApi, token, slot);
    yield put(
      updateDoctorAvailability.success(response.data.availability, meta?.navigate)
    );
    yield put(fetchDoctorAvailability(token)); // Refresh after update
  } catch (error) {
    yield put(updateDoctorAvailability.error(error.message, meta?.navigate));
  }
}

/**
 * Watcher saga: Listens for doctor availability actions.
 *
 * @generator
 * @function doctorAvailabilitySagas
 * @memberof store.sagas.doctorAvailabilitySagas
 * @yields {Generator} Saga watchers for availability actions.
 */
export default function* doctorAvailabilitySagas() {
  yield takeLatest(FETCH_DOCTOR_AVAILABILITY, fetchDoctorAvailabilitySaga);
  yield takeLatest(SAVE_DOCTOR_AVAILABILITY, saveDoctorAvailabilitySaga);
  yield takeLatest(UPDATE_DOCTOR_AVAILABILITY, updateDoctorAvailabilitySaga);
}
