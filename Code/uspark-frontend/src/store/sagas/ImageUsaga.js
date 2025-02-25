import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  uploadProfileImage,
} from "../actions/index";
import { UPLOAD_PROFILE_IMAGE} from "../actions/types";

function* uploadProfileImageSaga(action) {
  try {
    const response = yield call(axios.post, "http://localhost:5000/api/upload-profile-image", action.payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    yield put(uploadProfileImage.success(response.data.imageUrl));
  } catch (error) {
    yield put(uploadProfileImage.error(error.message));
  }
}

export function* watchUploadProfileImage() {
  yield takeLatest(UPLOAD_PROFILE_IMAGE, uploadProfileImageSaga);
}
