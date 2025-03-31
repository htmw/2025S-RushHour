/**
 * @file Handles authentication-related side effects using Redux-Saga.
 *
 * Manages user login, signup, and OAuth authentication.
 *
 * @namespace store.sagas.authSaga
 * @memberof store.sagas
 */

import { call, put, takeLatest } from "redux-saga/effects";
import {
  login,
  oAuthLogin,
  signup,
  oAuthSignup,
  fetchProfileImage,
} from "../actions";
import { enqueueSnackbar } from "notistack";
import { LOGIN, OAUTH_LOGIN, OAUTH_SIGNUP, SIGNUP } from "../actions/types";
import history from "../../history";
import { loginApi, oauthLoginApi, oAuthSignupApi, signupApi } from "../apis";

/**
 * Handles user login.
 *
 * @generator
 * @function handleLogin
 * @memberof store.sagas.authSaga
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
    yield put(fetchProfileImage());
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Login Failed";
    yield put(login.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

/**
 * Handles OAuth login (Google, Apple, etc.).
 *
 * @generator
 * @function handleOAuthLogin
 * @memberof store.sagas.authSaga
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
    yield put(fetchProfileImage());
  } catch (error) {
    const errorMsg = error.response?.data?.message || "OAuth Login Failed";
    yield put(oAuthLogin.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

/**
 * Handles user signup.
 *
 * @generator
 * @function handleSignup
 * @memberof store.sagas.authSaga
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
    yield put(fetchProfileImage());
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Signup Failed";
    yield put(signup.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

/**
 * Handles OAuth signup (Google, Apple, etc.).
 *
 * @generator
 * @function handleOAuthSignup
 * @memberof store.sagas.authSaga
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
    yield put(fetchProfileImage());
    history.push(userPayload.isOnboarded ? "/dashboard" : "/onboarding");
  } catch (error) {
    const errorMsg = error.response?.data?.message || "OAuth Signup Failed";
    yield put(oAuthSignup.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

/**
 * Watcher saga that listens for authentication-related actions.
 *
 * @generator
 * @function watchAuthSaga
 * @memberof store.sagas.authSaga
 * @yields {Generator} Watches for authentication actions and triggers the respective worker saga.
 */
export default function* watchAuthSaga() {
  yield takeLatest(SIGNUP, handleSignup);
  yield takeLatest(OAUTH_SIGNUP, handleOAuthSignup);
  yield takeLatest(LOGIN, handleLogin);
  yield takeLatest(OAUTH_LOGIN, handleOAuthLogin);
}
