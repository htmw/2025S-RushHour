/**
 * @file Redux-Saga for handling user logout.
 *
 * Clears authentication data and redirects the user to the login page.
 *
 * @namespace store.sagas.logout
 * @memberof store.sagas
 */

import { takeLatest } from "redux-saga/effects";
import { LOGOUT_USER } from "../actions/types";
import history from "../../history";

/**
 * Worker saga: Handles user logout.
 * Clears the authentication token from local storage and redirects to the login page.
 *
 * @generator
 * @function handleLogout
 * @memberof store.sagas.logout
 * @param {Object} action - Redux action object (not used but required by saga).
 * @yields {Generator} Saga effects for logout handling.
 */
function* handleLogout(action) {
  try {
    localStorage.setItem("token", ""); // Clear authentication token
    history.push("/login"); // Redirect to login page
  } catch (error) {
    // No error handling needed as logout is local
  }
}

/**
 * Watcher saga: Listens for the LOGOUT_USER action.
 * Triggers the worker saga when a logout action is dispatched.
 *
 * @generator
 * @function watchLogout
 * @memberof store.sagas.logout
 * @yields {Generator} Watches for LOGOUT_USER actions.
 */
export default function* watchLogout() {
  yield takeLatest(LOGOUT_USER, handleLogout);
}
