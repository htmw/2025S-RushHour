import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Grid2,
  Typography,
  MenuItem,
  Paper,
} from "@mui/material";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import {
  childMale,
  childFemale,
  teenMale,
  teenFemale,
  adultMale,
  adultFemale,
  elderlyMale,
  elderlyFemale,
  neutral,
} from "../../../../animations";
import { patientOnboarding } from "../../../store/actions";

const PatientQuestionnaire = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const { loading, error, patientData } = useSelector(
    (state) => state.onBoarding
  );

  const [formData, setFormData] = useState({
    name: user.fullName || "",
    age: "",
    sex: "",
    height: "",
    weight: "",
    healthIssues: "",
  });

  // useEffect(() => {
  //   if (patientData) {
  //     history.push("/dashboard");
  //   }
  // }, [patientData, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }, navigate);
  };

  const handleSubmit = () => {
    dispatch(patientOnboarding({ formData, token: user.token }, navigate));
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
            data-cy="onBoarding-name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            data-cy="onBoarding-age"
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
            data-cy="onBoarding-sex"
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
            data-cy="onBoarding-height"
            value={formData.height}
            onChange={handleChange}
            style={{ marginTop: 16 }}
          />
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            data-cy="onBoarding-weight"
            fullWidth
            value={formData.weight}
            onChange={handleChange}
            style={{ marginTop: 16 }}
          />
          <TextField
            label="Health Issues"
            name="healthIssues"
            data-cy="onBoarding-healthIssues"
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
            data-cy="onBoarding-submit"
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
