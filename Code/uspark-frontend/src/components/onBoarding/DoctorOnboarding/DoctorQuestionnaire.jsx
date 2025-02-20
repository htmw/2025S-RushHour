import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateDoctorData } from "../../../store/onBoardingSlice";
import { TextField, Button, Typography, Paper, Grid2 } from "@mui/material";

const DoctorQuestionnaire = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth); // ✅ Fetch logged-in user data
  const token = user.token;
  console.log({ token });
  const [formData, setFormData] = useState({
    name: user.fullName || "",
    specialization: "",
    experience: "",
    certifications: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // ✅ Send data to backend
      await axios.post(
        "http://localhost:5000/api/onboarding/doctor",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(updateDoctorData(formData));
      alert("Doctor Onboarding Completed!");
    } catch (err) {
      console.error("Onboarding Error:", err);
      setError(err.response?.data?.message || "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

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
