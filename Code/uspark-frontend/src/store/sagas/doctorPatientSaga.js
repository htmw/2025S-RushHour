// src/store/sagas/doctorPatientsSaga.js

import { call, put, takeLatest } from "redux-saga/effects";

import {
    FETCH_DOCTOR_PATIENTS,
    FETCH_DOCTOR_PATIENT_DETAILS,
} from "../actions/types";
import {
    fetchDoctorPatients,
    fetchDoctorPatientDetails,
} from "../actions";
import {
    fetchDoctorPatientsApi,
    fetchDoctorPatientDetailsApi,
} from "../apis";

function* handleFetchDoctorPatients(action) {
    try {
        yield put(fetchDoctorPatients.pending());
        const res = yield call(fetchDoctorPatientsApi, action.payload.token);
        yield put(fetchDoctorPatients.success(res.data));
    } catch (err) {
        yield put(fetchDoctorPatients.error(err.message));
    }
}

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

export default function* watchDoctorPatientsSaga() {
    yield takeLatest(FETCH_DOCTOR_PATIENTS, handleFetchDoctorPatients);
    yield takeLatest(FETCH_DOCTOR_PATIENT_DETAILS, handleFetchDoctorPatientDetails);
}
