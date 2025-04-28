import {
  MEDSEG_UPLOAD_API_PENDING,
  MEDSEG_UPLOAD_API_SUCCESS,
  MEDSEG_UPLOAD_API_ERROR,
  FETCH_SEGMENTATIONS_PENDING,
  FETCH_SEGMENTATIONS_SUCCESS,
  FETCH_SEGMENTATIONS_ERROR,
  RESEGMENT_IMAGE_PENDING,
  RESEGMENT_IMAGE_SUCCESS,
  RESEGMENT_IMAGE_ERROR,
  DELETE_SEGMENTED_IMAGE_PENDING,
  DELETE_SEGMENTED_IMAGE_SUCCESS,
  DELETE_SEGMENTED_IMAGE_ERROR,
} from "../actions/types";

const initialState = {
  loading: false,
  segmentedUrl: "",
  segmentations: [], // List of segmented images
  error: "",
};

export const medsegReducer = (state = initialState, action) => {
  switch (action.type) {
    // Upload Segmentation
    case MEDSEG_UPLOAD_API_PENDING:
      return { ...state, loading: true, error: "", segmentedUrl: "" };
    case MEDSEG_UPLOAD_API_SUCCESS:
      return {
        ...state,
        loading: false,
        segmentedUrl: action.payload,
        error: "",
      };
    case MEDSEG_UPLOAD_API_ERROR:
      return {
        ...state,
        loading: false,
        segmentedUrl: "",
        error: action.payload,
      };

    // Fetch Segmentations
    case FETCH_SEGMENTATIONS_PENDING:
      return { ...state, loading: true, error: "" };
    case FETCH_SEGMENTATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        segmentations: action.payload,
        error: "",
      };
    case FETCH_SEGMENTATIONS_ERROR:
      return {
        ...state,
        loading: false,
        segmentations: [],
        error: action.payload,
      };

    // Resegment Image
    case RESEGMENT_IMAGE_PENDING:
      return { ...state, loading: true, error: "" };
    case RESEGMENT_IMAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        segmentations: [...state.segmentations, action.payload], // Add new segmented image
        error: "",
      };
    case RESEGMENT_IMAGE_ERROR:
      return { ...state, loading: false, error: action.payload };

    // Delete Segmented Image
    case DELETE_SEGMENTED_IMAGE_PENDING:
      return { ...state, loading: true, error: "" };
    case DELETE_SEGMENTED_IMAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        segmentations: state.segmentations.filter(
          (url) => url !== action.payload
        ), // Remove deleted image
        error: "",
      };
    case DELETE_SEGMENTED_IMAGE_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
