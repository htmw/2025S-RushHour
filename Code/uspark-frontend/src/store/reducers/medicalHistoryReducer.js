import * as types from "../actions/types";

const initialState = {
    loading: false,
    error: null,
    histories: [],

};

const medicalHistoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.CREATE_MEDICAL_HISTORY_PENDING:
            return { ...state, loading: true, error: null };
        case types.CREATE_MEDICAL_HISTORY_SUCCESS:
            return { ...state, loading: false };
        case types.CREATE_MEDICAL_HISTORY_ERROR:
            return { ...state, loading: false, error: action.payload };
        case types.FETCH_MEDICAL_HISTORY_PENDING:
            return { ...state, loading: true, error: null };
        case types.FETCH_MEDICAL_HISTORY_SUCCESS:
            return { ...state, loading: false, histories: action.payload };
        case types.FETCH_MEDICAL_HISTORY_ERROR:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default medicalHistoryReducer;

