import {
    UPLOAD_PROFILE_IMAGE_SUCCESS,
    UPLOAD_PROFILE_IMAGE_FAILURE,
  } from "../actions/types";
  
  const initialState = {
    imageUrl: null,
    error: null,
  };
  
  const profileReducer = (state = initialState, action) => {
    switch (action.type) {
      case UPLOAD_PROFILE_IMAGE_SUCCESS:
        return {
          ...state,
          imageUrl: action.payload,
          error: null,
        };
      case UPLOAD_PROFILE_IMAGE_FAILURE:
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default profileReducer;
  