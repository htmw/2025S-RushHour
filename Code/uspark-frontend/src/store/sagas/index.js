/**
 * @fileoverview Combines and initializes all Redux sagas for the application.
 */

import { all, fork } from "redux-saga/effects";
import auth from "./authSaga";
import dashboard from "./dashboardSaga";
import onBoarding from "./onBoardingSaga";
import logout from "./logout";
import uploadProfileImage from "./ImageUsaga";
import adminSaga from "./adminSaga";
import doctorSaga from "./doctorSaga";

/**
 * List of all saga functions used in the application.
 * @constant {Array<Function>}
 */
const allSagas = [
  auth,
  dashboard,
  onBoarding,
  logout,
  uploadProfileImage,
  adminSaga,
  doctorSaga,
];

/**
 * Root saga that initializes and runs all application sagas.
 * Uses `fork` to run each saga in a non-blocking way.
 *
 * @generator
 * @function rootSaga
 * @yields {Generator} A Redux-Saga effect that initializes all sagas.
 */
export default function* rootSaga() {
  yield all(allSagas.map((saga) => fork(saga)));
}
