import { all, fork } from "redux-saga/effects";
import auth from "./authSaga";
import dashboard from "./dashboardSaga";
import onBoarding from "./onBoardingSaga";
import logout from "./logout";

const allSagas = [auth, dashboard, onBoarding, logout];

export default function* rootSaga() {
  yield all(allSagas.map((saga) => fork(saga)));
}
