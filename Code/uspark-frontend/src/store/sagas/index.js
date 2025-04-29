/**
 * @file Redux Sagas Index
 *
 * Combines and initializes all Redux sagas for the application.
 *
 * @namespace store.sagas
 * @memberof store
 */

import { all, fork } from "redux-saga/effects";
import auth from "./authSaga";
import dashboard from "./dashboardSaga";
import onBoarding from "./onBoardingSaga";
import logout from "./logout";
import profileImageSaga from "./profileImageSaga";
import adminSaga from "./adminSaga";
import healthIssuesSaga from "./healthIssuesSaga";
import forgotPasswordSaga from "./forgotPasswordSaga";
import insuranceSaga from "./insuranceSaga";
import medicalHistorySaga from "./medicalHistorySaga";
import profileSaga from "./profileSaga";
import appointmentsSaga from "./appointmentsSaga";
import doctorAvailabilitySaga from "./doctorAvailabilitySaga";
import doctorPatientSaga from "./doctorPatientSaga";
import chatHistorySaga from "./chatHistorySaga"; // Import the chat history saga
import assessmentSaga from "./assessmentSaga"; // Import the assessment saga
import medsegSaga from "./medsegSaga"; // Import the MedSeg saga
/**
 * List of all saga functions used in the application.
 *
 * @constant
 * @memberof store.sagas
 * @type {Function[]}
 */
const allSagas = [
  auth,
  dashboard,
  onBoarding,
  logout,
  profileImageSaga,
  adminSaga,
  healthIssuesSaga,
  forgotPasswordSaga,
  insuranceSaga,
  medicalHistorySaga,
  profileSaga,
  appointmentsSaga,
  doctorAvailabilitySaga,
  doctorPatientSaga,
  chatHistorySaga,
  assessmentSaga,
  medsegSaga,
];

/**
 * Root saga that initializes and runs all application sagas.
 * Uses `fork` to run each saga in a non-blocking way.
 *
 * @generator
 * @function rootSaga
 * @memberof store.sagas
 * @yields {Generator} A Redux-Saga effect that initializes all sagas.
 */
export default function* rootSaga() {
  yield all(allSagas.map((saga) => fork(saga)));
}
