/**
 * @file Redux reducer for managing the application's theme state.
 * Controls dark mode preference and updates local storage accordingly.
 *
 * @namespace store.reducers.themeReducer
 * @memberof store.reducers
 */

import { SET_THEME_SUCCESS } from "../actions/types";

/**
 * Initial state for the theme reducer.
 * @constant
 * @memberof store.reducers.themeReducer
 * @type {Object}
 * @property {boolean} darkMode - Determines if dark mode is enabled, based on local storage.
 */
const initialState = {
  darkMode: localStorage.getItem("theme") === "dark",
};

/**
 * Theme reducer for handling theme selection and persistence.
 *
 * @memberof store.reducers.themeReducer
 * @function themeReducer
 * @param {Object} state - The current theme state.
 * @param {Object} action - Redux action object.
 * @param {string} action.type - The action type.
 * @param {Object} [action.payload] - The action payload containing theme preference.
 * @param {boolean} action.payload.inDarkMode - Indicates if dark mode should be enabled.
 * @returns {Object} The updated theme state.
 */
const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME_SUCCESS:
      if (action.payload.inDarkMode) {
        localStorage.setItem("theme", "dark");
        return {
          ...state,
          darkMode: true,
        };
      } else {
        localStorage.setItem("theme", "light");
        return {
          ...state,
          darkMode: false,
        };
      }

    default:
      return state;
  }
};

export default themeReducer;
