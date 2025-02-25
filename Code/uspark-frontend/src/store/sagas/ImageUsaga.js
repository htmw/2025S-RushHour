import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  uploadProfileImageSuccess,
  uploadProfileImageFailure,
} from "../actions/index";
import { UPLOAD_PROFILE_IMAGE_REQUEST } from "../actions/types";

function* uploadProfileImage(action) {
  try {
    const response = yield call(axios.post, "http://localhost:5000/api/upload-profile-image", action.payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    yield put(uploadProfileImageSuccess(response.data.imageUrl));
  } catch (error) {
    yield put(uploadProfileImageFailure(error.message));
  }
}

export function* watchUploadProfileImage() {
  yield takeLatest(UPLOAD_PROFILE_IMAGE_REQUEST, uploadProfileImage);
}
