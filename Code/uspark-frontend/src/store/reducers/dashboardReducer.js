import * as types from "../actions/types";

const initialState = {
  userData: null,
  loading: false,
  error: null,
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DASHBOARD_PENDING:
      return { ...state, loading: true, error: null };

    case types.FETCH_DASHBOARD_SUCCESS:
      return { ...state, loading: false, userData: action.payload };

    case types.FETCH_DASHBOARD_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.UPLOAD_VERIFICATION_DOCS_PENDING:
      return { ...state, loading: true };

    case types.UPLOAD_VERIFICATION_DOCS_SUCCESS:
      return { ...state, loading: false };

    case types.UPLOAD_VERIFICATION_DOCS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default dashboardReducer;
