import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid2,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../store/actions";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { userData, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    if (auth.token) {
      dispatch(fetchDashboard({ token: auth.token }, navigate));
    }
  }, [auth.token, dispatch]);

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
          No user data found.
        </Typography>
      </Container>
    );
  }
  return (
    <Container sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 4 }} sx={{ textAlign: "center" }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                bgcolor: "primary.main",
              }}
            >
              {userData.fullName.charAt(0)}
            </Avatar>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {userData.fullName}
            </Typography>
            <Typography color="textSecondary">{userData.email}</Typography>
            <Typography color="textSecondary">Role: {userData.role}</Typography>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 8 }}>
            <Typography variant="h5">Profile Details</Typography>

            {userData.role === "patient" ? (
              <>
                <Typography>Age: {userData.age}</Typography>
                <Typography>Sex: {userData.sex}</Typography>
                <Typography>Height: {userData.height} cm</Typography>
                <Typography>Weight: {userData.weight} kg</Typography>
                <Typography>
                  Health Issues: {userData.healthIssues || "N/A"}
                </Typography>
              </>
            ) : userData.role === "doctor" ? (
              <>
                <Typography>
                  Specialization: {userData.specialization}
                </Typography>
                <Typography>Experience: {userData.experience} years</Typography>
                <Typography>
                  Certifications: {userData.certifications || "N/A"}
                </Typography>
              </>
            ) : (
              <Typography>No additional profile details found.</Typography>
            )}
          </Grid2>
        </Grid2>
      </Paper>
    </Container>
  );
};

export default Dashboard;
