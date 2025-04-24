/**
 * @file OneCard Component
 *
 * @namespace src.components.private.Dashboard.OneCard
 * @memberof src.components.private.Dashboard
 *
 * This component displays a patient's profile summary card. It includes personal
 * details, insurance information, and a preview of recent medical history along
 * with a QR code and avatar for quick identification.
 */

import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Avatar,
  Divider,
  Grid,
  Box,
  useTheme,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HealingIcon from "@mui/icons-material/Healing";
import moment from "moment";
/**
 * OneCard Component
 *
 * @memberof src.components.private.Dashboard.OneCard
 *
 * @param {Object} props
 * @param {Object} props.data - Patient data including personal info, insurance, and medical history.
 *
 * @returns {JSX.Element} - A stylized card displaying the patient's profile snapshot
 * with avatar, health info, insurance details, and recent medical history.
 *
 * @example
 * <OneCard data={userData} />
 */

const OneCard = ({ data }) => {
  const theme = useTheme();

  if (!data) return null;

  const {
    fullName,
    email,
    profileImage,
    qrCode,
    patientDetails,
    insuranceDetails,
    medicalHistory,
  } = data;

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 4,
        // background: theme.palette.background.default,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={profileImage} sx={{ width: 60, height: 60 }} />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>
        </Stack>
        {qrCode && (
          <Box>
            <Box
              component="img"
              src={qrCode}
              alt="QR Code"
              sx={{ width: 64, height: 64 }}
            />
          </Box>
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Personal Info */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>
            <strong>Age:</strong> {patientDetails.age || "—"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            <strong>Sex:</strong> {patientDetails.sex || "—"}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            <strong>Height:</strong> {patientDetails.height} cm
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            <strong>Weight:</strong> {patientDetails.weight} kg
          </Typography>
        </Grid>
        {patientDetails.healthIssues?.length > 0 && (
          <Grid item xs={12}>
            <Typography>
              <strong>Health Issues:</strong>{" "}
              <Box
                component="span"
                sx={{ color: theme.palette.error.main, fontWeight: 500 }}
              >
                {patientDetails.healthIssues.join(", ")}
              </Box>
            </Typography>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Insurance */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          <LocalHospitalIcon fontSize="small" sx={{ mr: 1 }} />
          Insurance
        </Typography>
        <Typography variant="body2">
          <strong>Provider:</strong> {insuranceDetails.providerName || "—"}
        </Typography>
        <Typography variant="body2">
          <strong>Policy:</strong> {insuranceDetails.holderName || "—"}
        </Typography>
        <Typography variant="body2">
          <strong>Valid:</strong>{" "}
          {moment(insuranceDetails.startDate).format("YYYY-MM-DD")} →{" "}
          {moment(insuranceDetails.endDate).format("YYYY-MM-DD")}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Medical History */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          <HealingIcon fontSize="small" sx={{ mr: 1 }} />
          Recent Medical History
        </Typography>
        {medicalHistory?.slice(0, 2).map((entry, i) => (
          <Typography key={i} variant="body2" sx={{ pl: 1.5 }}>
            • {entry.healthIssue} (
            <Box
              component="span"
              sx={{
                color:
                  entry.status === "ongoing"
                    ? theme.palette.warning.main
                    : theme.palette.success.main,
              }}
            >
              {entry.status}
            </Box>
            )
          </Typography>
        ))}
      </Box>
    </Paper>
  );
};

export default OneCard;
