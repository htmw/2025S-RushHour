/**
 * @fileoverview Handles authentication-related side effects using Redux-Saga.
 * Manages user login, signup, and OAuth authentication.
 */

import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { login, oAuthLogin, signup, oAuthSignup } from "../actions";
import { enqueueSnackbar } from "notistack";
import { LOGIN, OAUTH_LOGIN, OAUTH_SIGNUP, SIGNUP } from "../actions/types";
import history from "../../history";

// ✅ API Calls

/**
 * API request to log in a user with credentials.
 * @function
 * @param {Object} credentials - The user's email and password.
 * @returns {Promise<Object>} Response containing authentication token.
 */
const loginApi = (credentials) =>
  axios.post("http://localhost:5001/auth", credentials);

/**
 * API request to log in a user using OAuth (Google, Apple, etc.).
 * @function
 * @param {Object} providerData - OAuth provider data.
 * @returns {Promise<Object>} Response containing authentication token.
 */
const oauthLoginApi = (providerData) =>
  axios.post("http://localhost:5001/auth/oauth", providerData);

/**
 * API request to sign up a new user.
 * @function
 * @param {Object} userData - User registration details.
 * @returns {Promise<Object>} Response containing authentication token.
 */
const signupApi = (userData) =>
  axios.post("http://localhost:5001/auth/signup", userData);

/**
 * API request to sign up a new user via OAuth.
 * @function
 * @param {Object} providerData - OAuth provider data.
 * @returns {Promise<Object>} Response containing authentication token.
 */
const oAuthSignupApi = (providerData) =>
  axios.post("http://localhost:5001/auth/oauth", providerData);

/**
 * Handles user login.
 * @generator
 * @function handleLogin
 * @param {Object} action - Redux action containing payload.
 * @yields {Generator} Calls login API and updates Redux state.
 */
function* handleLogin(action) {
  const { navigate } = action.meta || {};
  try {
    yield put(login.pending());

    const response = yield call(loginApi, action.payload);
    const { token } = response.data;
    const userPayload = JSON.parse(atob(token.split(".")[1]));

    yield put(
      login.success({
        token,
        ...userPayload,
      })
    );
    localStorage.setItem("token", token);
    enqueueSnackbar("Login Successful!", { variant: "success" });

    history.push(userPayload.isOnboarded ? "/dashboard" : "/onboarding");
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Login Failed";
    yield put(login.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

/**
 * Handles OAuth login (Google, Apple, etc.).
 * @generator
 * @function handleOAuthLogin
 * @param {Object} action - Redux action containing payload.
 * @yields {Generator} Calls OAuth login API and updates Redux state.
 */
function* handleOAuthLogin(action) {
  const { navigate } = action.meta || {};

  try {
    yield put(oAuthLogin.pending());

    const response = yield call(oauthLoginApi, action.payload);
    const { token } = response.data;
    const userPayload = JSON.parse(atob(token.split(".")[1]));

    yield put(
      oAuthLogin.success({
        token,
        ...userPayload,
      })
    );
    localStorage.setItem("token", token);
    enqueueSnackbar("OAuth Login Successful!", { variant: "success" });

    history.push(userPayload.isOnboarded ? "/dashboard" : "/onboarding");
  } catch (error) {
    const errorMsg = error.response?.data?.message || "OAuth Login Failed";
    yield put(oAuthLogin.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

/**
 * Handles user signup.
 * @generator
 * @function handleSignup
 * @param {Object} action - Redux action containing payload.
 * @yields {Generator} Calls signup API and updates Redux state.
 */
function* handleSignup(action) {
  const { navigate } = action.meta || {};

  try {
    yield put(signup.pending());

    const response = yield call(signupApi, action.payload);
    const { token } = response.data;
    const userPayload = JSON.parse(atob(token.split(".")[1]));

    yield put(
      signup.success({
        token,
        ...userPayload,
      })
    );
    localStorage.setItem("token", token);
    enqueueSnackbar("Signup Successful!", { variant: "success" });

    history.push(userPayload.isOnboarded ? "/dashboard" : "/onboarding");
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Signup Failed";
    yield put(signup.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

/**
 * Handles OAuth signup (Google, Apple, etc.).
 * @generator
 * @function handleOAuthSignup
 * @param {Object} action - Redux action containing payload.
 * @yields {Generator} Calls OAuth signup API and updates Redux state.
 */
function* handleOAuthSignup(action) {
  const { navigate } = action.meta || {};

  try {
    yield put(oAuthSignup.pending());

    const response = yield call(oAuthSignupApi, action.payload);
    const { token } = response.data;
    const userPayload = JSON.parse(atob(token.split(".")[1]));

    yield put(
      oAuthSignup.success({
        token,
        ...userPayload,
      })
    );
    localStorage.setItem("token", token);
    enqueueSnackbar("OAuth Signup Successful!", { variant: "success" });

    history.push(userPayload.isOnboarded ? "/dashboard" : "/onboarding");
  } catch (error) {
    const errorMsg = error.response?.data?.message || "OAuth Signup Failed";
    yield put(oAuthSignup.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

/**
 * Watcher saga that listens for authentication-related actions.
 * @generator
 * @function watchSignupSaga
 * @yields {Generator} Watches for authentication actions and triggers the respective worker saga.
 */
export default function* watchSignupSaga() {
  yield takeLatest(SIGNUP, handleSignup);
  yield takeLatest(OAUTH_SIGNUP, handleOAuthSignup);
  yield takeLatest(LOGIN, handleLogin);
  yield takeLatest(OAUTH_LOGIN, handleOAuthLogin);
}
