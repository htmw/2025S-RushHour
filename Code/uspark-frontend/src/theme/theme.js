// src/theme.js
import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "light", // Switch to "light" if you want a brighter UI
    primary: {
      main: "#2979FF", // Bright Blue
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#43A047", // Emerald Green
    },
    background: {
      default: "#121212", // Deep Black for dark mode
      paper: "#F5F5F5", // Light gray for contrast elements
    },
    text: {
      primary: "#E3F2FD", // Soft White for high readability
      secondary: "#F5F5F5", // Lighter Blue for subtext
    },
    error: {
      main: "#FF3D00", // Vibrant Red for alerts/errors
    },
    warning: {
      main: "#FF9800", // Orange for warnings
    },
    success: {
      main: "#43A047", // Green for positive actions
    },
    action: {
      hover: "#2979FF", // Blue hover effect
      selected: "#43A047", // Green active state
    },
  },
  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
    h1: { fontSize: "2.2rem", fontWeight: 700, color: "#E3F2FD" },
    h2: { fontSize: "1.8rem", fontWeight: 600, color: "#90CAF9" },
    h5: { fontWeight: 600, color: "#E3F2FD" },
    body1: { fontSize: "1rem", color: "#E3F2FD" },
    button: { fontSize: "1rem", fontWeight: "bold", textTransform: "none" },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "#1E1E1E", // Dark input background
            borderRadius: "8px", // Rounded corners
            color: "#E3F2FD", // White text inside
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#2979FF", // Default border
            },
            "&:hover fieldset": {
              borderColor: "#90CAF9", // Light blue on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#43A047", // Green when focused
            },
          },
          "& .MuiInputLabel-root": {
            color: "#90CAF9", // Light blue label
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#43A047", // Green label when focused
          },
          "& .MuiFormHelperText-root": {
            color: "#90CAF9", // Lighter text for hints
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10, // Smooth rounded edges
          textTransform: "none", // No all-caps
          padding: "8px 16px",
        },
        containedPrimary: {
          backgroundColor: "#2979FF",
          "&:hover": { backgroundColor: "#1565C0" }, // Darker blue on hover
        },
        containedSecondary: {
          backgroundColor: "#43A047",
          "&:hover": { backgroundColor: "#388E3C" },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#E3F2FD", // Soft white text
          "&:hover": {
            backgroundColor: "#2979FF", // Blue hover effect
            color: "#FFF",
            borderRadius: 10,
          },
          "&.Mui-selected": {
            backgroundColor: "#43A047 !important", // Green when selected
            color: "#FFF",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E", // Slightly lighter than black
          borderRadius: 10,
          padding: "24px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212", // Keep header black for contrast
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light", // Light theme mode
    primary: {
      main: "#2979FF", // Bright Blue
      contrastText: "#FFFFFF", // White text on primary buttons
    },
    secondary: {
      main: "#43A047", // Emerald Green
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F5F5", // Full white background
      paper: "#808080", // Light gray for contrast elements
    },
    text: {
      primary: "#212121", // Dark text for readability
      secondary: "#546E7A", // Subtle gray-blue for supporting text
    },
    error: {
      main: "#D32F2F", // Red for error messages
    },
    warning: {
      main: "#FFA000", // Amber for warnings
    },
    success: {
      main: "#43A047", // Green for success states
    },
    action: {
      hover: "#2979FF20", // Light blue hover effect
      selected: "#43A04720", // Light green active state
    },
  },
  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
    h1: { fontSize: "2.2rem", fontWeight: 700, color: "#212121" },
    h2: { fontSize: "1.8rem", fontWeight: 600, color: "#2979FF" },
    h5: { fontWeight: 600, color: "#212121" },
    body1: { fontSize: "1rem", color: "#212121" },
    button: { fontSize: "1rem", fontWeight: "bold", textTransform: "none" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Smooth rounded edges
          textTransform: "none", // No all-caps
          padding: "10px 20px",
          boxShadow: "none",
        },
        containedPrimary: {
          backgroundColor: "#2979FF",
          "&:hover": { backgroundColor: "#1565C0" }, // Darker blue on hover
        },
        containedSecondary: {
          backgroundColor: "#43A047",
          "&:hover": { backgroundColor: "#388E3C" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "#FFFFFF", // White input background
            borderRadius: "8px", // Rounded corners
            color: "#212121", // Dark text
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#90CAF9", // Light blue border
            },
            "&:hover fieldset": {
              borderColor: "#2979FF", // Darker blue on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#43A047", // Green when focused
            },
          },
          "& .MuiInputLabel-root": {
            color: "#546E7A", // Subtle gray label
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#2979FF", // Blue label when focused
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF", // Light header
          color: "#212121", // Dark text
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)", // Soft shadow for depth
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "64px", // Standard height
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#212121", // Dark menu text
          "&:hover": {
            backgroundColor: "#2979FF20", // Light blue hover
            color: "#2979FF",
            borderRadius: 6,
          },
          "&.Mui-selected": {
            backgroundColor: "#43A04720", // Light green when selected
            color: "#43A047",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF", // White paper cards
          borderRadius: 10,
          padding: "20px",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)", // Light shadow for depth
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
