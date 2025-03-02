import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { login, oAuthLogin, signup, oAuthSignup } from "../actions";
import { enqueueSnackbar } from "notistack";
import { LOGIN, OAUTH_LOGIN, OAUTH_SIGNUP, SIGNUP } from "../actions/types";
import history from "../../history";

// ✅ API Calls
const loginApi = (credentials) =>
  axios.post("http://localhost:5000/auth", credentials);
const oauthLoginApi = (providerData) =>
  axios.post("http://localhost:5000/auth/oauth", providerData);
const signupApi = (userData) =>
  axios.post("http://localhost:5000/auth/signup", userData);
const oAuthSignupApi = (providerData) =>
  axios.post("http://localhost:5000/auth/oauth", providerData);

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
    if (userPayload.isOnboarded) {
      history.push("/dashboard");
    } else {
      history.push("/onboarding");
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Login Failed";
    yield put(login.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

// ✅ Worker Saga: OAuth Login
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
    if (userPayload.isOnboarded) {
      history.push("/dashboard");
    } else {
      history.push("/onboarding");
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || "OAuth Login Failed";
    yield put(oAuthLogin.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

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
    if (userPayload.isOnboarded) {
      history.push("/dashboard");
    } else {
      history.push("/onboarding");
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Signup Failed";
    yield put(signup.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

// ✅ Worker Saga: OAuth Signup (Google/Apple)
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
    if (userPayload.isOnboarded) {
      history.push("/dashboard");
    } else {
      history.push("/onboarding");
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || "OAuth Signup Failed";
    yield put(oAuthSignup.error(errorMsg));
    enqueueSnackbar(errorMsg, { variant: "error" });
  }
}

export default function* watchSignupSaga() {
  yield takeLatest(SIGNUP, handleSignup);
  yield takeLatest(OAUTH_SIGNUP, handleOAuthSignup);
  yield takeLatest(LOGIN, handleLogin);
  yield takeLatest(OAUTH_LOGIN, handleOAuthLogin);
}
