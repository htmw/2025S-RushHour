/**
 * @fileoverview Redux reducer for managing user profile-related state.
 * Handles profile image uploads and error management.
 */

import {
  UPLOAD_PROFILE_IMAGE_SUCCESS,
  UPLOAD_PROFILE_IMAGE_ERROR,
} from "../actions/types";

/**
 * Initial state for the profile reducer.
 * @constant
 * @type {Object}
 * @property {string|null} error - Stores error messages related to profile image uploads, if any.
 */
const initialState = {
  error: null,
};

/**
 * Profile reducer for handling profile image upload success and errors.
 *
 * @function profileReducer
 * @param {Object} state - The current profile state.
 * @param {Object} action - Redux action object.
 * @param {string} action.type - The action type.
 * @param {any} [action.payload] - The action payload containing error messages.
 * @returns {Object} The updated profile state.
 */
const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_PROFILE_IMAGE_SUCCESS:
      return {
        ...state,
        error: null,
      };

    case UPLOAD_PROFILE_IMAGE_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default profileReducer;
