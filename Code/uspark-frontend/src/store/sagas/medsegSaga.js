import { call, put, takeLatest, select } from "redux-saga/effects";
import {
  FETCH_SEGMENTATIONS,
  RESEGMENT_IMAGE,
  DELETE_SEGMENTED_IMAGE,
  DOCTOR_UPLOAD,
} from "../actions/types";
import {
  fetchSegmentations,
  resegmentImage,
  deleteSegmentedImage,
  doctorUpload,
} from "../actions";
import {
  fetchSegmentationsApi,
  resegmentImageApi,
  deleteSegmentedImageApi,
  doctorUploadApi,
} from "../apis";

function* handleFetchSegmentations(action) {
  try {
    const token = yield select((state) => state.auth?.token);

    yield put(fetchSegmentations.pending());
    const res = yield call(fetchSegmentationsApi, token); // No doctorId needed
    yield put(fetchSegmentations.success(res.data.segmentations));
  } catch (err) {
    yield put(fetchSegmentations.error(err.message));
  }
}

function* handleResegmentImage(action) {
  try {
    const token = yield select((state) => state.auth?.token);

    yield put(resegmentImage.pending());
    const res = yield call(resegmentImageApi, action.payload, token);
    yield put(resegmentImage.success(res.data.s3Url));
  } catch (err) {
    yield put(resegmentImage.error(err.message));
  }
}

function* handleDeleteSegmentedImage(action) {
  try {
    const token = yield select((state) => state.auth?.token);

    yield put(deleteSegmentedImage.pending());
    yield call(deleteSegmentedImageApi, action.payload, token);
    yield put(deleteSegmentedImage.success(action.payload.segmentedUrl));
  } catch (err) {
    yield put(deleteSegmentedImage.error(err.message));
  }
}

function* handleDoctorUpload(action) {
  try {
    yield put(doctorUpload.pending());
    console.log({ action });

    const res = yield call(
      doctorUploadApi,
      action.payload.formData,
      action.payload.token
    ); // Send FormData
    yield put(doctorUpload.success(res.data));
  } catch (err) {
    yield put(doctorUpload.error(err.message));
  }
}

export default function* watchMedsegSaga() {
  yield takeLatest(FETCH_SEGMENTATIONS, handleFetchSegmentations);
  yield takeLatest(RESEGMENT_IMAGE, handleResegmentImage);
  yield takeLatest(DELETE_SEGMENTED_IMAGE, handleDeleteSegmentedImage);
  yield takeLatest(DOCTOR_UPLOAD, handleDoctorUpload); // Add doctor upload watcher
}
