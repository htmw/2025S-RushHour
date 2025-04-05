import {
    FETCH_DOCTOR_AVAILABILITY_PENDING,
    FETCH_DOCTOR_AVAILABILITY_SUCCESS,
    FETCH_DOCTOR_AVAILABILITY_ERROR,
    SAVE_DOCTOR_AVAILABILITY_PENDING,
    SAVE_DOCTOR_AVAILABILITY_SUCCESS,
    SAVE_DOCTOR_AVAILABILITY_ERROR,
} from "../actions/types";

const initialState = {
    availability: [],
    loading: false,
    error: null,
};

const doctorAvailabilityReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DOCTOR_AVAILABILITY_PENDING:
        case SAVE_DOCTOR_AVAILABILITY_PENDING:
            return { ...state, loading: true, error: null };

        case FETCH_DOCTOR_AVAILABILITY_SUCCESS:
        case SAVE_DOCTOR_AVAILABILITY_SUCCESS:
            return { ...state, availability: action.payload, loading: false };

        case FETCH_DOCTOR_AVAILABILITY_ERROR:
        case SAVE_DOCTOR_AVAILABILITY_ERROR:
            return { ...state, error: action.payload, loading: false };

        default:
            return state;
    }
};

export default doctorAvailabilityReducer;
