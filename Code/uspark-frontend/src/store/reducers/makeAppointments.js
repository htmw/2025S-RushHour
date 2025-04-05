import * as types from "../actions/types";

const initialState = {
    hospitals: [],
    doctors: [],
    loading: false,
    error: null,
    appointmentSuccess: false,
};

const makeAppointmentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_HOSPITALS_PENDING:
        case types.CREATE_APPOINTMENT_PENDING:
        case types.FETCH_DOCTORS_PENDING:
            return { ...state, loading: true, error: null, appointmentSuccess: false };

        case types.FETCH_HOSPITALS_SUCCESS:
            return { ...state, loading: false, hospitals: action.payload };

        case types.FETCH_DOCTORS_SUCCESS:
            return { ...state, loading: false, doctors: action.payload };

        case types.CREATE_APPOINTMENT_SUCCESS:
            return { ...state, loading: false, appointmentSuccess: true };

        case types.FETCH_HOSPITALS_ERROR:
        case types.FETCH_DOCTORS_ERROR:
        case types.CREATE_APPOINTMENT_ERROR:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default makeAppointmentsReducer;
