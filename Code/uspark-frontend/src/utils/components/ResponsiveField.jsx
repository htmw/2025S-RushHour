import React from "react";
import { TextField, Typography, useMediaQuery, Grid2 } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ResponsiveField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  ...rest
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid2
      container
      spacing={2}
      alignItems="center"
      sx={{ mb: 2 }}
      direction={isMobile ? "column" : "row"}
    >
      <Grid2 item size={{ xs: isMobile ? 12 : 4 }}>
        <Typography fontWeight="bold">{label}:</Typography>
      </Grid2>
      <Grid2 item size={{ xs: isMobile ? 12 : 8 }}>
        <TextField
          fullWidth
          name={name}
          type={type}
          size="small"
          value={value}
          onChange={onChange}
          {...rest}
        />
      </Grid2>
    </Grid2>
  );
};

export default ResponsiveField;
