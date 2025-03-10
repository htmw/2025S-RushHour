/**
 * @file Role selection component for onboarding.
 *
 * Allows users to select their role as a doctor or patient during the onboarding process.
 *
 * @namespace src.components.private.onBoarding.RoleSelection
 * @memberof src.components.private.onBoarding
 */

import React from "react";
import { useDispatch } from "react-redux";
import { Button, Typography, Grid2, Paper } from "@mui/material";
import Lottie from "lottie-react";
import doctorAnimation from "../../../../animations/Doctor.json";
import patientAnimation from "../../../../animations/Patient.json";
import { roleSelection } from "../../../store/actions";
import { useNavigate } from "react-router-dom";

/**
 * RoleSelection Component
 *
 * A selection screen for users to choose between a patient or doctor role.
 *
 * @component
 * @memberof src.components.private.onBoarding.RoleSelection
 * @returns {JSX.Element} The onboarding role selection component.
 */
const RoleSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Handles role selection and dispatches action to update state.
   *
   * @function
   * @memberof src.components.private.onBoarding.RoleSelection
   * @param {string} role - The selected user role (`"patient"` or `"doctor"`).
   */
  const handleRoleSelect = (role) => {
    dispatch(roleSelection(role, navigate));
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        data-cy="Choose-Your-Role"
      >
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
              data-cy="role-select-patient"
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
              data-cy="role-select-doctor"
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
