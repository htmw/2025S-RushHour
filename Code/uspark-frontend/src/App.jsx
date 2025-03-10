/**
 * @file Main entry point of the application.
 *
 * Provides global state management, theme switching, and routing.
 *
 * @module App
 */

import React from "react";
import AppRoutes from "./routes/routes";
import { Provider, useSelector } from "react-redux";
import store from "./store/store.js";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme/theme.js";
import SnackbarCustomizedProvider from "./components/public/SnackBarCustomizedProvider.jsx";

import "./App.css";

/**
 * Wrapper component that manages theme selection based on Redux state.
 * Uses Material UI's ThemeProvider to apply light or dark mode.
 *
 * @component
 * @memberof module:App
 * @returns {JSX.Element} The application wrapped in the appropriate theme.
 *
 * @example
 * <AppWrapper />
 */
const AppWrapper = () => {
  /**
   * Selects the current theme mode from the Redux store.
   * @constant
   * @memberof module:App
   * @type {boolean}
   */
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <SnackbarCustomizedProvider />
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
};

/**
 * Root component of the application.
 * Provides the Redux store and wraps the app in the AppWrapper.
 *
 * @component
 * @memberof module:App
 * @returns {JSX.Element} The main application wrapped with Redux Provider.
 *
 * @example
 * <App />
 */
function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;
