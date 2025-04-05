import { call, put, takeLatest } from "redux-saga/effects";
import {
    fetchDoctorAvailabilityApi,
    saveDoctorAvailabilityApi,
    updateDoctorAvailabilityApi
} from "../apis"

import {
    fetchDoctorAvailability,
    saveDoctorAvailability,
    updateDoctorAvailability
} from "../actions";
import {
    FETCH_DOCTOR_AVAILABILITY,
    SAVE_DOCTOR_AVAILABILITY,
    UPDATE_DOCTOR_AVAILABILITY
} from "../actions/types";

function* fetchDoctorAvailabilitySaga({ payload, meta }) {
    try {
        yield put(fetchDoctorAvailability.pending(meta?.navigate));
        const response = yield call(fetchDoctorAvailabilityApi, payload);
        yield put(fetchDoctorAvailability.success(response.data.availability, meta?.navigate));
    } catch (error) {
        yield put(fetchDoctorAvailability.error(error.message, meta?.navigate));
    }
}

function* saveDoctorAvailabilitySaga({ payload, meta }) {
    try {
        yield put(saveDoctorAvailability.pending(meta?.navigate));
        const { token, slots } = payload;
        const response = yield call(saveDoctorAvailabilityApi, token, slots);
        yield put(saveDoctorAvailability.success(response.data.availability, meta?.navigate));
    } catch (error) {
        yield put(saveDoctorAvailability.error(error.message, meta?.navigate));
    }
}

function* updateDoctorAvailabilitySaga({ payload, meta }) {
    try {
        yield put(updateDoctorAvailability.pending(meta?.navigate));
        const { token, slot } = payload;
        const response = yield call(updateDoctorAvailabilityApi, token, slot);
        yield put(updateDoctorAvailability.success(response.data.availability, meta?.navigate));
        yield put(fetchDoctorAvailability(token))
    } catch (error) {
        yield put(updateDoctorAvailability.error(error.message, meta?.navigate));
    }
}
export default function* doctorAvailabilitySagas() {
    yield takeLatest(FETCH_DOCTOR_AVAILABILITY, fetchDoctorAvailabilitySaga);
    yield takeLatest(SAVE_DOCTOR_AVAILABILITY, saveDoctorAvailabilitySaga);
    yield takeLatest(UPDATE_DOCTOR_AVAILABILITY, updateDoctorAvailabilitySaga);

}
