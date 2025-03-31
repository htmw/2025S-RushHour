import { call, put, select, takeLatest, all } from "redux-saga/effects";
import { uploadProfileImageApi, fetchProfileImageApi } from "../apis";
import { uploadProfileImage, fetchProfileImage, login } from "../actions";
import { UPLOAD_PROFILE_IMAGE, FETCH_PROFILE_IMAGE } from "../actions/types";

/**
 * Worker saga: Handles uploading the profile image.
 * Dispatches pending, success, or error actions accordingly.
 * Also updates the login state with the new image URL.
 * @generator
 * @function uploadProfileImageSaga
 * @memberof store.sagas.ImageUsaga
 * @param {Object} action - Redux action object.
 * @param {string} action.payload - The image URL to be uploaded.
 * @yields {Generator} Saga effects for uploading the image and updating the login state.
 */
function* uploadProfileImageSaga(action) {
  try {
    yield put(uploadProfileImage.pending());
    const token = yield select((state) => state.auth.token);
    const response = yield call(uploadProfileImageApi, token, action.payload);

    yield put(uploadProfileImage.success(response.data.imageUrl));
    yield put(login.success({ image: response.data.imageUrl }));
  } catch (error) {
    yield put(uploadProfileImage.error(error.message));
  }
}
/**
 * Worker saga: Handles fetching the profile image.
 * Dispatches success or error actions accordingly.
 *
 * @generator
 * @function fetchProfileImageSaga
 * @memberof store.sagas.ImageUsaga
 * @yields {Generator} Saga effects for API call and state updates.
 */

function* fetchProfileImageSaga() {
  try {
    yield put(fetchProfileImage.pending());
    const token = yield select((state) => state.auth.token);
    const response = yield call(fetchProfileImageApi, token);

    yield put(fetchProfileImage.success(response.data.image));
  } catch (error) {
    yield put(fetchProfileImage.error(error.message));
  }
}

/**
 * Watches for profile image-related actions and triggers the respective worker saga.
 *
 * @generator
 * @function watchProfileImageSagas
 * @memberof store.sagas.ImageUsaga
 * @yields {Generator} Saga effects for watching and triggering profile image upload and fetch actions.
 */
export default function* watchProfileImageSagas() {
  yield all([
    takeLatest(UPLOAD_PROFILE_IMAGE, uploadProfileImageSaga),
    takeLatest(FETCH_PROFILE_IMAGE, fetchProfileImageSaga),
  ]);
}
