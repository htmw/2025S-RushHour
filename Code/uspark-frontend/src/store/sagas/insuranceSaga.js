import { call, put, takeLatest, select } from "redux-saga/effects";
import { CREATE_INSURANCE, FETCH_INSURANCE } from "../actions/types";
import { createInsurance, fetchInsurance } from "../actions";
import { createInsuranceApi, fetchInsuranceApi } from "../apis";
import { enqueueSnackbar } from "notistack";

/**
 * Handles creating insurance details.
 *
 * @generator
 * @function handleCreateInsurance
 * @memberof store.sagas.insuranceSaga
 * @param {Object} action - Redux action containing payload.
 * @yields {Generator} Calls create insurance API and updates Redux state.
 */
function* handleCreateInsurance(action) {
  try {
    yield put(createInsurance.pending());
    const token = yield select((state) => state.auth?.token);
    yield call(createInsuranceApi, action.payload, token);
    yield put(createInsurance.success());
    enqueueSnackbar("Insurance details created!", { variant: "success" });
  } catch (error) {
    const message = error.response?.data?.message || "Create insurance failed";
    yield put(createInsurance.error(message));
    enqueueSnackbar(message, { variant: "error" });
  }
}

/**
 * Worker saga: Handles fetching insurance details.
 *
 * @generator
 * @function handleFetchInsurance
 * @memberof store.sagas.insuranceSaga
 * @yields {Generator} Saga effects for API call and state updates.
 * @throws Will dispatch an error action if the API call fails.
 */

function* handleFetchInsurance() {
  try {
    yield put(fetchInsurance.pending());
    const token = yield select((state) => state.auth?.token);
    const response = yield call(fetchInsuranceApi, token);
    yield put(fetchInsurance.success(response.data));
  } catch (error) {
    console.log({ error });
    const message = error.response?.data?.message || "Fetch insurance failed";
    yield put(fetchInsurance.error(message));
    enqueueSnackbar(message, { variant: "error" });
  }
}

/**
 * Watcher saga: Listens for insurance-related actions.
 * Triggers worker sagas when corresponding actions are dispatched.
 *
 * @generator
 * @function watchInsuranceSaga
 * @memberof store.sagas.insuranceSaga
 * @yields {Generator} Watches for CREATE_INSURANCE and FETCH_INSURANCE actions.
 */
export default function* watchInsuranceSaga() {
  yield takeLatest(CREATE_INSURANCE, handleCreateInsurance);
  yield takeLatest(FETCH_INSURANCE, handleFetchInsurance);
}
