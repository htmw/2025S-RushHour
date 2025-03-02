import { SET_THEME_SUCCESS } from "../actions/types";

const initialState = {
  darkMode: localStorage.getItem("theme") === "dark",
};

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
