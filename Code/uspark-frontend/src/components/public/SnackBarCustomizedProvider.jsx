import React from "react";

import { SnackbarProvider, closeSnackbar } from "notistack";
import { Close } from "@mui/icons-material";

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
