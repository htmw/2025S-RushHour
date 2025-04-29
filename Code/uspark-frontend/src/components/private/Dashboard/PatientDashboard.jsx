import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Stack, Fab, useTheme } from "@mui/material";
import { Chat as ChatIcon, Close as CloseIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../../store/actions";

import HealthNewsCard from "./HealthNewsCard.jsx";
import OneCard from "./OneCard";
import InitialAssessmentCard from "./InitialAssesment.jsx";
import AppointmentsPage from "./Appointments.jsx";
import MakeAppointments from "./MakeAppointments.jsx";
import ChatBox from "../Chatbot/Chatbox.jsx";

const PatientDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { userData, loading } = useSelector((state) => state.dashboard);

  const [isChatOpen, setIsChatOpen] = useState(false);

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
        position: "relative",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={600}
        gutterBottom
        color="text.primary"
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
            <InitialAssessmentCard openChat={() => setIsChatOpen(true)} />
            <AppointmentsPage />
          </Stack>
        </Grid>
      </Grid>

      {/* Chatbox */}
      {isChatOpen && <ChatBox onClose={() => setIsChatOpen(false)} />}

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <Fab
          color="primary"
          aria-label="chat"
          onClick={() => setIsChatOpen(!isChatOpen)}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1100,
          }}
        >
          <ChatIcon />
        </Fab>
      )}
    </Box>
  );
};

export default PatientDashboard;
