/**
 * @file DoctorDashboard Component
 *
 * @namespace src.components.private.Dashboard.DoctorDashboard
 * @memberof src.components.private.Dashboard
 *
 * This component renders the doctor's dashboard view, displaying profile details,
 * verification status, QR code, and a calendar of availability integrated with appointments.
 * It fetches doctor availability and appointment data via Redux.
 */

import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import {
  AccessTime,
  Assignment,
  Email,
  LocalHospital,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments, fetchDoctorAvailability } from "../../../store/actions";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import DoctorAvailabilityCalendar from "./DoctorAvailability.jsx";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


/**
 * DoctorDashboard Component
 *
 * @memberof src.components.private.Dashboard.DoctorDashboard
 *
 * @param {Object} props
 * @param {Object} props.userData - The logged-in doctor's profile data including details and QR code.
 *
 * @returns {JSX.Element} - Displays the doctor’s profile info along with availability calendar
 * and appointment integration.
 *
 * @example
 * <DoctorDashboard userData={userData} />
 */

const DoctorDashboard = ({ userData }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { availability } = useSelector((state) => state.doctorAvailability);
  const { data: appointments } = useSelector(state => state.appointments);

  const {
    fullName,
    email,
    role,
    profileImage,
    qrCode,
    doctorDetails = {},
  } = userData || {};

  const {
    specialization,
    experience,
    certifications,
    verificationStatus,
  } = doctorDetails;

  const statusColor = {
    pending: "warning",
    approved: "success",
    rejected: "error",
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchDoctorAvailability(token));
      dispatch(fetchAppointments({ token })); // ✅ also fetch appointments

    }
  }, [dispatch, token]);
  console.log({ availability });

  return (
    <Container sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Grid container spacing={4}>
          {/* Left Side - Doctor Info */}
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Avatar
                src={profileImage || ""}
                alt={fullName}
                sx={{ width: 120, height: 120, fontSize: 40, bgcolor: "#1976d2" }}
              >
                {fullName?.[0]}
              </Avatar>
              <Typography variant="h6" fontWeight="bold" data-cy="doctor-dashboard-name">{fullName}</Typography>
              <Chip label={role?.toUpperCase()} color="info" variant="outlined" />
              <img
                src={qrCode}
                alt="QR Code"
                style={{ width: 120, height: 120, marginTop: 16 }}
              />
              <Divider sx={{ width: "100%", my: 2 }} />
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography><Email fontSize="small" /> {email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><LocalHospital fontSize="small" /> Specialization: <strong>{specialization || "N/A"}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><AccessTime fontSize="small" /> Experience: <strong>{experience} years</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><Assignment fontSize="small" /> Certifications: <strong>{certifications || "N/A"}</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography fontWeight="bold" mt={2}>Verification:</Typography>
                  <Chip
                    label={verificationStatus?.toUpperCase()}
                    color={statusColor[verificationStatus] || "default"}
                    variant="filled"
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Side - Calendar Replaces Previous Block */}
          <Grid item xs={12} md={6}>
            {availability?.length > 0 ? (
              <DoctorAvailabilityCalendar availability={availability} appointments={appointments} />
            ) : (
              <Typography variant="body1">Loading availability...</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DoctorDashboard;
