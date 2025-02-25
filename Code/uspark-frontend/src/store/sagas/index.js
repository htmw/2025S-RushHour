import { all, fork } from "redux-saga/effects";
import auth from "./authSaga";
import dashboard from "./dashboardSaga";
import onBoarding from "./onBoardingSaga";
import logout from "./logout";
import { watchUploadProfileImage } from "./ImageUsaga";

const allSagas = [auth, dashboard, onBoarding, logout, watchUploadProfileImage];

export default function* rootSaga() {
  yield all(allSagas.map((saga) => fork(saga)));
}
