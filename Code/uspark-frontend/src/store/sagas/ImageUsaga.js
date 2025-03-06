/**
 * @fileoverview Redux-Saga for handling profile image uploads.
 * Manages secure file uploads and updates the user's profile image in state.
 */

import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { login, uploadProfileImage } from "../actions/index";
import { UPLOAD_PROFILE_IMAGE } from "../actions/types";

/**
 * Worker saga: Handles uploading a user's profile image.
 * Dispatches success or error actions and updates the user's profile image in Redux state.
 *
 * @generator
 * @function uploadProfileImageSaga
 * @param {Object} action - Redux action object.
 * @param {FormData} action.payload - The form data containing the profile image file.
 * @yields {Generator} Saga effects for uploading the profile image and updating the user state.
 */
function* uploadProfileImageSaga(action) {
  try {
    const response = yield call(
      axios.post,
      "http://localhost:5000/api/upload-profile-image",
      action.payload,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // Dispatch success action for profile image upload
    yield put(uploadProfileImage.success());

    // Update the user profile in the Redux store with the new image URL
    yield put(login.success({ imageUrl: response.data.imageUrl }));
  } catch (error) {
    yield put(uploadProfileImage.error(error.message));
  }
}

/**
 * Watcher saga: Listens for profile image upload actions.
 * Triggers the worker saga when an upload action is dispatched.
 *
 * @generator
 * @function watchUploadProfileImage
 * @yields {Generator} Watches for UPLOAD_PROFILE_IMAGE actions.
 */
export default function* watchUploadProfileImage() {
  yield takeLatest(UPLOAD_PROFILE_IMAGE, uploadProfileImageSaga);
}
