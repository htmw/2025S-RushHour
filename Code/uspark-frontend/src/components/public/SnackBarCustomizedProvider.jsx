/**
 * @file A custom Snackbar provider component for handling notifications.
 * Uses `notistack` to display dismissible snackbars.
 *
 * @namespace src.components.public.SnackBarCustomizedProvider
 * @memberof src.components.public
 */

import React from "react";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { Close } from "@mui/icons-material";

/**
 * SnackbarCustomizedProvider Component
 *
 * Provides a global notification system with customized settings.
 *
 * @component
 * @memberof src.components.public.SnackBarCustomizedProvider
 * @returns {JSX.Element} A configured `SnackbarProvider` component.
 */
const SnackbarCustomizedProvider = () => (
  <SnackbarProvider
    dense
    maxSnack={4}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    action={(snackbarId) => (
      <Close
        sx={{
          cursor: "pointer",
        }}
        onClick={() => {
          closeSnackbar(snackbarId);
        }}
      />
    )}
  />
);

export default SnackbarCustomizedProvider;
