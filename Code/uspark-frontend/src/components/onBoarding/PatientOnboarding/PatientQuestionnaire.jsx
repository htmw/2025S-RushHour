import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updatePatientData } from "../../../store/onBoardingSlice";
import {
  TextField,
  Button,
  Grid2,
  Typography,
  MenuItem,
  Paper,
} from "@mui/material";
import Lottie from "lottie-react";
import childMale from "../../../../animations/child_male.json";
import childFemale from "../../../../animations/child_female.json";
import teenMale from "../../../../animations/teen_male.json";
import teenFemale from "../../../../animations/teen_female.json";
import adultMale from "../../../../animations/adult_male.json";
import adultFemale from "../../../../animations/adult_female.json";
import elderlyMale from "../../../../animations/elderly_male.json";
import elderlyFemale from "../../../../animations/elderly_female.json";
import neutral from "../../../../animations/neutral.json";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const PatientQuestionnaire = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth); // ✅ Fetch logged-in user data
  const token = user.token;

  const [formData, setFormData] = useState({
    name: user.fullName || "",
    age: "",
    sex: "",
    height: "",
    weight: "",
    healthIssues: "",
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
        "http://localhost:5000/api/onboarding/patient",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(updatePatientData(formData));
      enqueueSnackbar("Patient Onboarding Completed!", {
        variant: "success",
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding Error:", err);
      setError(err.response?.data?.message || "Onboarding failed");
      enqueueSnackbar(err.response?.data?.message || "Onboarding failed", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to select Lottie animation
  const getAnimation = () => {
    const age = parseInt(formData.age);
    const sex = formData.sex;

    if (!age || !sex) return neutral;
    if (age < 10) return sex === "male" ? childMale : childFemale;
    if (age >= 10 && age < 21) return sex === "male" ? teenMale : teenFemale;
    if (age >= 21 && age < 50) return sex === "male" ? adultMale : adultFemale;
    return sex === "male" ? elderlyMale : elderlyFemale;
  };

  return (
    <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h5" gutterBottom>
        Patient Health Questionnaire
      </Typography>

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            fullWidth
            value={formData.age}
            onChange={handleChange}
            style={{ marginTop: 16 }}
          />
          <TextField
            label="Sex"
            name="sex"
            select
            fullWidth
            value={formData.sex}
            onChange={handleChange}
            style={{ marginTop: 16 }}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
          <TextField
            label="Height (cm)"
            name="height"
            type="number"
            fullWidth
            value={formData.height}
            onChange={handleChange}
            style={{ marginTop: 16 }}
          />
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            fullWidth
            value={formData.weight}
            onChange={handleChange}
            style={{ marginTop: 16 }}
          />
          <TextField
            label="Health Issues"
            name="healthIssues"
            fullWidth
            multiline
            rows={3}
            value={formData.healthIssues}
            onChange={handleChange}
            style={{ marginTop: 16 }}
          />

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
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <Lottie animationData={getAnimation()} loop={true} />
        </Grid2>
      </Grid2>
    </Paper>
  );
};

export default PatientQuestionnaire;
