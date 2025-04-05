// src/store/reducers/doctorPatientsReducer.js
import {
    FETCH_DOCTOR_PATIENTS_PENDING,
    FETCH_DOCTOR_PATIENTS_SUCCESS,
    FETCH_DOCTOR_PATIENTS_ERROR,
    FETCH_DOCTOR_PATIENT_DETAILS_PENDING,
    FETCH_DOCTOR_PATIENT_DETAILS_SUCCESS,
    FETCH_DOCTOR_PATIENT_DETAILS_ERROR,
} from "../actions/types";

const initialState = {
    patients: [],
    patientDetails: null,
    loading: false,
    error: null,
};

export const doctorPatientsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DOCTOR_PATIENTS_PENDING:
        case FETCH_DOCTOR_PATIENT_DETAILS_PENDING:
            return { ...state, loading: true, error: null };

        case FETCH_DOCTOR_PATIENTS_SUCCESS:
            return { ...state, loading: false, patients: action.payload };

        case FETCH_DOCTOR_PATIENT_DETAILS_SUCCESS:
            return { ...state, loading: false, patientDetails: action.payload };

        case FETCH_DOCTOR_PATIENTS_ERROR:
        case FETCH_DOCTOR_PATIENT_DETAILS_ERROR:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
