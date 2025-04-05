import * as types from "../actions/types";

const initialState = {
    data: [],
    loading: false,
    error: null,
};

const appointmentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_APPOINTMENTS_PENDING:
            return { ...state, loading: true, error: null };

        case types.FETCH_APPOINTMENTS_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case types.FETCH_APPOINTMENTS_ERROR:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default appointmentsReducer;


