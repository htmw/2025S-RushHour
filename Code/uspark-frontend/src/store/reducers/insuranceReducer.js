import * as types from "../actions/types";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

/**
 * Reducer for managing insurance-related state.
 *
 * @function
 * @param {Object} state - The current insurance state.
 * @param {Object} action - Redux action object.
 * @param {string} action.type - The action type.
 * @param {any} [action.payload] - The action payload containing insurance data or error messages.
 * @returns {Object} The updated insurance state.
 */
const insuranceReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_INSURANCE_PENDING:
    case types.FETCH_INSURANCE_PENDING:
      return { ...state, loading: true, error: null };

    case types.CREATE_INSURANCE_SUCCESS:
      return { ...state, loading: false };

    case types.FETCH_INSURANCE_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case types.CREATE_INSURANCE_ERROR:
    case types.FETCH_INSURANCE_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default insuranceReducer;
