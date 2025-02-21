import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  Grid2,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = auth.token;
        const response = await axios.get(
          "http://localhost:5000/api/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth.token]);

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

  if (!userData) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Failed to load user data.
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
