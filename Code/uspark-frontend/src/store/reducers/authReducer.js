/**
 * @fileoverview Redux reducer for managing authentication state.
 * Handles user login, OAuth login, signup, and logout actions.
 */

import * as types from "../actions/types";

/**
 * Retrieves the authentication token from local storage.
 * @constant {string|null}
 */
const localStorageToken = localStorage.getItem("token");

/**
 * Parses the user payload from the authentication token.
 * @constant {Object}
 */
const userPayload = localStorageToken
  ? JSON.parse(atob(localStorageToken.split(".")[1]))
  : {};
console.log({ userPayload });

/**
 * Initial state for the authentication reducer.
 * @constant
 * @type {Object}
 * @property {string|null} token - The authentication token.
 * @property {string} email - The user's email.
 * @property {string} fullName - The user's full name.
 * @property {boolean} loading - Indicates if an authentication request is in progress.
 * @property {boolean} isOnboarded - Whether the user has completed onboarding.
 * @property {string|null} error - Stores error messages, if any.
 * @property {string} imageUrl - The user's profile image URL.
 */
const initialState = {
  token: localStorageToken,
  email: "",
  fullName: "",
  loading: false,
  isOnboarded: false,
  error: null,
  imageUrl: "",
  ...userPayload,
};

/**
 * Authentication reducer for handling login, signup, OAuth, and logout actions.
 *
 * @function authReducer
 * @param {Object} state - The current authentication state.
 * @param {Object} action - Redux action object.
 * @param {string} action.type - The action type.
 * @param {any} [action.payload] - The action payload containing authentication data.
 * @returns {Object} The updated authentication state.
 */
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_PENDING:
    case types.OAUTH_LOGIN_PENDING:
    case types.SIGNUP_PENDING:
    case types.OAUTH_SIGNUP_PENDING:
      return { ...state, loading: true, error: null };

    case types.LOGIN_SUCCESS:
    case types.OAUTH_LOGIN_SUCCESS:
    case types.SIGNUP_SUCCESS:
    case types.OAUTH_SIGNUP_SUCCESS:
      return { ...state, ...action.payload, loading: false };

    case types.LOGIN_ERROR:
    case types.OAUTH_LOGIN_ERROR:
    case types.SIGNUP_ERROR:
    case types.OAUTH_SIGNUP_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.LOGOUT_USER:
      return {};

    default:
      return state;
  }
};

export default authReducer;
