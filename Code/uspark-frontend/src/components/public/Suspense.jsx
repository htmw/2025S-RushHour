import React from "react";
import { CircularProgress, Box, useTheme } from "@mui/material";

const LoadingSpinner = ({ size = 120, containerHeight = "80vh", color }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: containerHeight,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <CircularProgress
        size={size}
        thickness={4}
        sx={{
          color: color || theme.palette.primary.main,
        }}
      />
    </Box>
  );
};

export default LoadingSpinner;
