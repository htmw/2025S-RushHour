// src/App.js
import React from "react";
import AppRoutes from "./routes/routes";
import { Provider, useSelector } from "react-redux";
import store from "./store/store.js";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme/theme.js";
import SnackbarCustomizedProvider from "./components/public/SnackBarCustomizedProvider.jsx";

import "./App.css";

const AppWrapper = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <SnackbarCustomizedProvider />
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
};
function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;
