import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../store/actions";
import { useNavigate } from "react-router-dom";
import ProfileImageUpload from "../Dashboard/Imageupload";
import PatientProfile from "./PatientProfile";
import DoctorProfile from "./DoctorProfile";
import PatientHomePage from "../../pages/Patient";
import DoctorHomePage from "../../pages/Doctor";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { userData, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (auth.token) {
      dispatch(fetchDashboard({ token: auth.token }, navigate));
    }
  }, [auth.token, dispatch, navigate]);

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={80} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <Typography variant="h5" color="textSecondary">
          No user data found
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Profile Image Upload Component */}
          

          {/* Profile Details Section */}
          <Grid item xs={12} md={8}>
            {userData.role === "patient" ? (
              <PatientHomePage/>
            ) : userData.role === "doctor" ? (
              <DoctorHomePage/>
            ) : (
              <Typography>No additional profile details found.</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
