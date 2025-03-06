/**
 * @fileoverview A reusable loading spinner component.
 * Displays a centered circular progress indicator.
 */

import React from "react";
import { CircularProgress, Box, useTheme } from "@mui/material";

/**
 * LoadingSpinner Component
 *
 * @component
 * @param {Object} props - Component props.
 * @param {number} [props.size=120] - The size of the spinner.
 * @param {string} [props.containerHeight="80vh"] - The height of the container.
 * @param {string} [props.color] - Custom color for the spinner (defaults to theme primary color).
 * @returns {JSX.Element} A centered circular progress indicator.
 */
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
