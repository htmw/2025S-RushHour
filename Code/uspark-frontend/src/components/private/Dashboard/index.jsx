/**
 * @file Dashboard Component
 *
 * @namespace src.components.private.Dashboard
 * @memberof src.components.private
 *
 * This is the main Dashboard entry component that renders role-specific dashboards
 * for patients, doctors, and admins. It checks authentication and onboarding status,
 * fetches dashboard data, and handles loading/error states.
 */

import React, { useEffect } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../../store/actions";
import { useNavigate } from "react-router-dom";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard.jsx";
import AdminDashboard from "./AdminDashboard";

/**
 * Dashboard Component
 *
 * @memberof src.components.private.Dashboard
 *
 * @returns {JSX.Element} - Renders the appropriate dashboard based on the user's role.
 * Displays loading and error states while fetching dashboard data.
 *
 * @example
 * <Dashboard />
 */

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { userData, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (!auth.isOnboarded) {
      navigate("/onBoarding");
    } else if (auth.token && !userData) {
      dispatch(fetchDashboard({ token: auth.token }, navigate));
    }
  }, [auth.token, auth.isOnboarded, userData, dispatch, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" align="center" color="text.secondary">
          No user data found.
        </Typography>
      </Box>
    );
  }

  // ⬇️ Let each role render its own fully styled dashboard
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      {userData.role === "patient" ? (
        <PatientDashboard />
      ) : userData.role === "doctor" ? (
        <DoctorDashboard userData={userData} />
      ) : userData.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <Container sx={{ py: 5 }}>
          <Typography align="center">
            No additional profile details found.
          </Typography>
        </Container>
      )}
    </Box>
  );
};

export default Dashboard;
