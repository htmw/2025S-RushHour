import { takeLatest } from "redux-saga/effects";
import { LOGOUT_USER } from "../actions/types";
import history from "../../history";

// ✅ Worker Saga: Fetch Logout Data
function* handleLogout(action) {
  try {
    localStorage.setItem("token", "");
    history.push("/login");
  } catch (error) {}
}

// ✅ Watcher Saga
export default function* watchLogout() {
  yield takeLatest(LOGOUT_USER, handleLogout);
}
