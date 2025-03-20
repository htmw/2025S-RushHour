/**
 * @file Redux reducer for managing forgot password state.
 *
 * @namespace store.reducers.forgotPassword
 * @memberof store.reducers
 */

import * as types from "../actions/types";

const initialState = {
  loading: false,
  error: null,
};

/**
 *
 * @function forgotPassword
 * @memberof store.reducers.forgotPassword
 * @param {Object} state - The current state of the reducer.
 * @param {Object} action - The action object.
 * @param {string} action.type - The type of the action.
 * @param {any} [action.payload] - The payload associated with the action.
 * @returns {Object} The updated state of the reducer.
 */
const forgotPassword = (state = initialState, action) => {
  switch (action.type) {
    case types.FORGOT_PASSWORD_PENDING:
      return { ...state, loading: true, error: null };

    case types.FORGOT_PASSWORD_SUCCESS:
      return { ...state, loading: false };

    case types.FORGOT_PASSWORD_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default forgotPassword;
