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
    <Container>
      
        
        <Grid >
          {/* Uncomment below if you want to show the profile image upload */}
          {/* <Grid item xs={12} md={4}>
            <ProfileImageUpload userData={userData} />
          </Grid> */}
          <Grid  >
            {userData.role === "patient" ? (
              <PatientHomePage />
            ) : userData.role === "doctor" ? (
              <DoctorHomePage />
            ) : (
              <Typography align="center">
                No additional profile details found.
              </Typography>
            )}
          </Grid>
        </Grid>
      
    </Container>
  );
};

export default Dashboard;
