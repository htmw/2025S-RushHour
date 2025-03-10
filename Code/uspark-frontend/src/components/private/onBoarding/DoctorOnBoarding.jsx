/**
 * @file Doctor onboarding questionnaire component.
 *
 * Collects doctor-specific details such as specialization, experience, and certifications.
 *
 * @namespace src.components.private.onBoarding.DoctorOnBoarding
 * @memberof src.components.private.onBoarding
 */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Typography, Paper, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doctorOnboarding } from "../../../store/actions";
import history from "../../../history";

/**
 * DoctorOnBoarding Component
 *
 * A form to collect doctor details for onboarding.
 *
 * @component
 * @memberof src.components.private.onBoarding.DoctorOnBoarding
 * @returns {JSX.Element} The doctor onboarding form component.
 */
const DoctorOnBoarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const { doctorData, loading, error } = useSelector(
    (state) => state.onBoarding
  );

  /**
   * Doctor onboarding form state.
   *
   * @type {Object}
   * @property {string} name - Doctor's full name.
   * @property {string} specialization - Doctor's area of expertise.
   * @property {string} experience - Doctor's years of experience.
   * @property {string} certifications - Doctor's certifications.
   */
  const [formData, setFormData] = useState({
    name: user.fullName || "",
    specialization: "",
    experience: "",
    certifications: "",
  });

  /**
   * Handles input changes and updates state.
   *
   * @function
   * @memberof src.components.private.onBoarding.DoctorOnBoarding
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }, navigate);
  };

  /**
   * Handles form submission by dispatching doctor onboarding action.
   *
   * @function
   * @memberof src.components.private.onBoarding.DoctorOnBoarding
   */
  const handleSubmit = () => {
    dispatch(doctorOnboarding({ formData, token: user.token }, navigate));
  };

  /**
   * Redirects to the dashboard if onboarding is complete.
   *
   * @function
   * @memberof src.components.private.onBoarding.DoctorOnBoarding
   * @effect Runs when `doctorData` updates.
   */
  useEffect(() => {
    if (doctorData) {
      history.push("/dashboard");
    }
  }, [doctorData, navigate]);

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h5" gutterBottom>
        Doctor Onboarding
      </Typography>

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label="Specialization"
            name="specialization"
            fullWidth
            value={formData.specialization}
            onChange={handleChange}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label="Years of Experience"
            name="experience"
            type="number"
            fullWidth
            value={formData.experience}
            onChange={handleChange}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            label="Certifications"
            name="certifications"
            fullWidth
            multiline
            rows={3}
            value={formData.certifications}
            onChange={handleChange}
          />
        </Grid2>
      </Grid2>

      {error && (
        <Typography color="error" variant="body2" style={{ marginTop: 10 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </Paper>
  );
};

export default DoctorOnBoarding;
