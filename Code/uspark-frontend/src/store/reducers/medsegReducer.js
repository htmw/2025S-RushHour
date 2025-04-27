import {
    MEDSEG_UPLOAD_API_PENDING,
    MEDSEG_UPLOAD_API_SUCCESS,
    MEDSEG_UPLOAD_API_ERROR,
  } from "../actions/types";
  
  const initialState = {
    loading: false,
    segmentedUrl: "",
    error: "",
  };
  
  export const medsegReducer = (state = initialState, action) => {
    switch (action.type) {
      case MEDSEG_UPLOAD_API_PENDING:
        return { ...state, loading: true, error: "", segmentedUrl: "" };
      case MEDSEG_UPLOAD_API_SUCCESS:
        return { ...state, loading: false, segmentedUrl: action.payload, error: "" };
      case MEDSEG_UPLOAD_API_ERROR:
        return { ...state, loading: false, segmentedUrl: "", error: action.payload };
      default:
        return state;
    }
  };
  