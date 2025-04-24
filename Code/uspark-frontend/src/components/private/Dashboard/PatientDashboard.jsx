/**
 * @file PatientDashboard Component
 *
 * @namespace src.components.private.Dashboard.PatientDashboard
 * @memberof src.components.private.Dashboard
 *
 * This component renders the main dashboard view for patients. It includes
 * personalized information, appointment booking, recent appointments, initial
 * assessment, and health news. It fetches patient dashboard data on load.
 */

import React, { useEffect } from "react";
import { Box, Grid, Typography, Stack, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../../store/actions";

import HealthNewsCard from "./HealthNewsCard.jsx";
import OneCard from "./OneCard";
import InitialAssessmentCard from "./InitialAssesment";
import AppointmentsPage from "./Appointments.jsx";
import MakeAppointments from "./MakeAppointments.jsx";

/**
 * PatientDashboard Component
 *
 * @memberof src.components.private.Dashboard.PatientDashboard
 *
 * @returns {JSX.Element} - A responsive two-column layout showing patient data,
 * health news, appointment booking, and other personalized dashboard components.
 *
 * @example
 * <PatientDashboard />
 */

const PatientDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { userData, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (token && !userData && !loading) {
      dispatch(fetchDashboard({ token }));
    }
  }, [token, userData, loading, dispatch]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 4, md: 8 },
      }}
    >
      <Typography
        variant="h4"
        fontWeight={600}
        gutterBottom
        color="text.primary"
        data-cy="dashboard-welcome"
      >
        🩺 Patient Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <HealthNewsCard />
            <MakeAppointments />
          </Stack>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            <OneCard data={userData} />
            <InitialAssessmentCard />
            <AppointmentsPage />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;
