// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Custom Primary Color
    },
    secondary: {
      main: "#ff5722", // Custom Secondary Color
    },
    background: {
      default: "#f4f6f8", // Background Color
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h5: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded Buttons
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "20px",
        },
      },
    },
  },
});

export default theme;
