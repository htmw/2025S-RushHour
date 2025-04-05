import {
    FETCH_APPOINTMENTS,
    FETCH_HOSPITALS,
    FETCH_DOCTORS,
    CREATE_APPOINTMENT,
    UPDATE_APPOINTMENT,
    DELETE_APPOINTMENT,
} from "../actions/types";
import { fetchAppointments, fetchHospitals, createAppointment, fetchDoctors } from "../actions";

import {
    fetchAppointmentsApi,
    fetchHospitalsApi,
    createAppointmentApi,
    updateAppointmentApi,
    deleteAppointmentApi,
    fetchDoctorsApi,
} from "../apis";

import { call, put, takeLatest } from "redux-saga/effects";

function* handleFetchAppointments(action) {
    try {
        yield put(fetchAppointments.pending());
        const response = yield call(fetchAppointmentsApi, action.payload.token);
        yield put(fetchAppointments.success(response.data));
    } catch (error) {
        yield put(fetchAppointments.error(error.message));
    }
}

function* handleFetchDoctors(action) {
    try {
        yield put(fetchDoctors.pending());
        console.log({ action });

        const response = yield call(fetchDoctorsApi, action.payload.token);
        yield put(fetchDoctors.success(response.data));
    } catch (error) {
        yield put(fetchDoctors.error("Failed to fetch doctors."));
    }
}


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

function* handleUpdateAppointment(action) {
    try {
        const { id, token, ...payload } = action.payload;
        yield call(updateAppointmentApi, id, payload, token);
        yield put(fetchAppointments({ token }));
    } catch (error) {
        console.error("Update appointment error:", error);
    }
}

function* handleDeleteAppointment(action) {
    try {
        const { id, token } = action.payload;
        yield call(deleteAppointmentApi, id, token);
        yield put(fetchAppointments({ token }));
    } catch (error) {
        console.error("Delete appointment error:", error);
    }
}


export default function* watchAppointmentsSaga() {
    yield takeLatest(FETCH_APPOINTMENTS, handleFetchAppointments);
    yield takeLatest(FETCH_HOSPITALS, handleFetchHospitals);
    yield takeLatest(CREATE_APPOINTMENT, handleCreateAppointment);
    yield takeLatest(UPDATE_APPOINTMENT, handleUpdateAppointment);
    yield takeLatest(DELETE_APPOINTMENT, handleDeleteAppointment);
    yield takeLatest(FETCH_DOCTORS, handleFetchDoctors); // ✅ NEW

}




