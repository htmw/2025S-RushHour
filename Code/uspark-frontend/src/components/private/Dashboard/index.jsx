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

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { userData, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (!auth.isOnboarded) {
      navigate("/onBoarding");
    } else {
      if (auth.token) {
        dispatch(fetchDashboard({ token: auth.token }, navigate));
      }
    }
  }, [auth, dispatch, navigate]);

  if (loading) {
    return (
      <Container>
        <CircularProgress size={80} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

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
            ) : userData.role === "doctor" ? (
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
