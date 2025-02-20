// src/components/Onboarding/RoleSelection.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { setRole } from "../../store/onBoardingSlice";
import { Button, Typography, Grid2, Paper } from "@mui/material";
import Lottie from "lottie-react";
import doctorAnimation from "../../../animations/Doctor.json";
import patientAnimation from "../../../animations/Patient.json";

const RoleSelection = () => {
  const dispatch = useDispatch();

  const handleRoleSelect = (role) => {
    dispatch(setRole(role));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Choose Your Role
      </Typography>

      <Grid2 container spacing={4} justifyContent="center">
        {/* Patient Role */}
        <Grid2 item size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={3}
            style={{ padding: 16, textAlign: "center", cursor: "pointer" }}
            onClick={() => handleRoleSelect("patient")}
          >
            <Lottie animationData={patientAnimation} style={{ height: 200 }} />
            <Typography variant="h6" gutterBottom>
              I am a Patient
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRoleSelect("patient")}
            >
              Select Patient
            </Button>
          </Paper>
        </Grid2>

        {/* Doctor Role */}
        <Grid2 item size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={3}
            style={{ padding: 16, textAlign: "center", cursor: "pointer" }}
            onClick={() => handleRoleSelect("doctor")}
          >
            <Lottie animationData={doctorAnimation} style={{ height: 200 }} />
            <Typography variant="h6" gutterBottom>
              I am a Doctor
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRoleSelect("doctor")}
            >
              Select Doctor
            </Button>
          </Paper>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default RoleSelection;
