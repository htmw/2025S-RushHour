import React from "react";
import {
  TextField,
  Typography,
  useMediaQuery,
  MenuItem,
  Grid2
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ResponsiveField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  select = false,
  options = [],
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
        <Typography fontWeight="bold">
          {label} {required ? "*" : ""}
        </Typography>
      </Grid2>
      <Grid2 item size={{ xs: isMobile ? 12 : 8 }}>
        <TextField
          fullWidth
          name={name}
          type={type}
          size="small"
          value={value}
          onChange={onChange}
          select={select}
          {...(select ? { 'data-cy': rest?.inputProps?.['data-cy'] } : {})}
          {...rest}
        >
          {select &&
            options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
        </TextField>
      </Grid2>
    </Grid2>
  );
};

export default ResponsiveField;

