// src/App.js
import React from "react";
import AppRoutes from "./routes/routes";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme.js";
import SnackbarCustomizedProvider from "./components/SnackBarCustomizedProvider.jsx";
import "./App.css";
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarCustomizedProvider />
        <CssBaseline /> {/* Normalizes CSS across browsers */}
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
