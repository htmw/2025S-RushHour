/**
 * @file Dashboard component.
 *
 * Displays different dashboards based on the user's role (Patient, Doctor, or Admin).
 * Fetches user data and ensures proper onboarding before allowing access.
 *
 * @namespace src.components.private.Dashboard
 * @memberof src.components.private
 */

import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid2,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../../store/actions";
import { useNavigate } from "react-router-dom";
import PatientHomePage from "../Patient/Patient";
import DoctorHomePage from "../Doctor/Doctor";
import AdminDashboard from "./AdminDashboard";

/**
 * Dashboard Component
 *
 * Manages the main dashboard view by rendering different layouts based on the user's role.
 * Redirects non-onboarded users to the onboarding page.
 *
 * @component
 * @memberof src.components.private.Dashboard
 * @returns {JSX.Element} The dashboard component.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** @type {Object} */
  const auth = useSelector((state) => state.auth);

  /** @type {Object} */
  const { userData, loading, error } = useSelector((state) => state.dashboard);

  /**
   * Ensures only onboarded users access the dashboard.
   * Fetches user data if authenticated.
   *
   * @function
   * @memberof src.components.private.Dashboard
   * @effect Runs when `auth` state changes.
   */
  useEffect(() => {
    if (!auth.isOnboarded) {
      navigate("/onBoarding");
    } else if (auth.token) {
      dispatch(fetchDashboard({ token: auth.token }, navigate));
    }
  }, [auth, dispatch, navigate]);

  // Loading state
  if (loading) {
    return (
      <Container>
        <CircularProgress size={80} />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  // No user data
  if (!userData) {
    return (
      <Container>
        <Typography variant="h5" color="textSecondary" align="center">
          No user data found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid2 container spacing={4}>
          <Grid2 item size={{ xs: 12, md: 8 }}>
            {userData.role === "patient" ? (
              <PatientHomePage />
            ) : userData.role === "doctor" ? (
              <DoctorHomePage />
            ) : userData.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Typography align="center">
                No additional profile details found.
              </Typography>
            )}
          </Grid2>
        </Grid2>
      </Paper>
    </Container>
  );
};

export default Dashboard;
