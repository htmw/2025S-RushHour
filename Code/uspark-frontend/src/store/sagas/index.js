import { all, fork } from "redux-saga/effects";
import auth from "./authSaga";
import dashboard from "./dashboardSaga";
import onBoarding from "./onBoardingSaga";
import logout from "./logout";
import uploadProfileImage from "./ImageUsaga";
import adminSaga from "./adminSaga";
import doctorSaga from "./doctorSaga";

const allSagas = [
  auth,
  dashboard,
  onBoarding,
  logout,
  uploadProfileImage,
  adminSaga,
  doctorSaga,
];

export default function* rootSaga() {
  yield all(allSagas.map((saga) => fork(saga)));
}
