import * as types from "../actions/types";

const initialState = {
  doctors: [],
  loading: false,
  error: null,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DOCTORS_PENDING:
      return { ...state, loading: true, error: null };

    case types.FETCH_DOCTORS_SUCCESS:
      return { ...state, loading: false, doctors: action.payload };

    case types.FETCH_DOCTORS_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.VERIFY_DOCTOR_PENDING:
      return { ...state, loading: true };

    case types.VERIFY_DOCTOR_SUCCESS:
      return { ...state, loading: false };

    case types.VERIFY_DOCTOR_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default adminReducer;
