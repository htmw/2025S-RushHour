import * as types from "../actions/types";

const initialState = {
  imageUrl: null,
  loading: false,
  error: null,
};

/**
 * Reducer for managing profile image-related state.
 *
 * @function
 * @param {Object} state - The current profile state.
 * @param {Object} action - Redux action object.
 * @param {string} action.type - The action type.
 * @param {any} [action.payload] - The action payload containing image URL or error messages.
 * @returns {Object} The updated profile state.
 */

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPLOAD_PROFILE_IMAGE_PENDING:
    case types.FETCH_PROFILE_IMAGE_PENDING:
      return { ...state, loading: true, error: null };

    case types.UPLOAD_PROFILE_IMAGE_SUCCESS:
    case types.FETCH_PROFILE_IMAGE_SUCCESS:
      return { ...state, loading: false, imageUrl: action.payload };

    case types.UPLOAD_PROFILE_IMAGE_ERROR:
    case types.FETCH_PROFILE_IMAGE_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default profileReducer;
