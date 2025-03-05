import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Typography, Paper, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doctorOnboarding } from "../../../store/actions";

const DoctorQuestionnaire = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
    const userOnboarded = useSelector((state) => state.auth.isOnboarded);
  
  const { loading, error } = useSelector(
    (state) => state.onBoarding
  );

  const [formData, setFormData] = useState({
    name: user.fullName || "",
    specialization: "",
    experience: "",
    certifications: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }, navigate);
  };

  const handleSubmit = () => {
    dispatch(doctorOnboarding({ formData, token: user.token }, navigate));
  };
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

export default DoctorQuestionnaire;
