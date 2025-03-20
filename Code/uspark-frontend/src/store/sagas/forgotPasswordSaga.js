import { call, put, takeLatest } from "redux-saga/effects";
import { FORGOT_PASSWORD } from "../actions/types";
import { forgotPassword } from "../actions";
import { forgotPasswordApi } from "../apis";
import history from "../../history";
import { enqueueSnackbar } from "notistack";
/**
 *
 * @function forgotPasswordSaga
 * @description Handles the forgot password API call and dispatches the success or error action.
 * @param {Object} action - The Redux action object.
 * @returns {Generator} A generator that handles the API call and dispatches the success or error action.
 */
function* forgotPasswordSaga(action) {
  try {
    const { email } = action.payload;
    console.log({ email });
    const response = yield call(forgotPasswordApi, email);
    console.log({ response });
    yield put(forgotPassword.success(response.data));
    // history.push("/login");
  } catch (error) {
    console.log({ error });

    enqueueSnackbar(error.response?.data?.message || "Failed", {
      variant: "error",
    });
    yield put(forgotPassword.error(error.response?.data?.message || "Failed"));
  }
}

export default function* watchHealthIssuesSaga() {
  yield takeLatest(FORGOT_PASSWORD, forgotPasswordSaga);
}
