import React, { useEffect } from "react";
import { Box, Grid, Typography, Paper, Stack } from "@mui/material";
import HealthNewsCard from "./HealthNewsCard.jsx";
import OneCard from "./OneCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../../store/actions";
import InitialAssessmentCard from "./InitialAssesment";
import AppointmentsPage from "./Appointments.jsx";
import MakeAppointments from "./MakeAppointments.jsx";


const PatientDashboard = () => {
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
                backgroundColor: "#f5f7fa",
                minHeight: "100vh",
                py: 4,
                px: { xs: 2, sm: 4, md: 8 },
            }}
        >
            <Typography variant="h4" fontWeight={600} gutterBottom data-cy="dashboard-welcome"
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
