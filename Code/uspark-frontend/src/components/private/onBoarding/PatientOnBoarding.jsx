/**
 * @file Patient health questionnaire component for onboarding.
 *
 * Collects patient health details including age, sex, height, weight, and health issues.
 *
 * @namespace src.components.private.onBoarding.PatientOnBoarding
 * @memberof src.components.private.onBoarding
 */

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Grid2,
  Typography,
  MenuItem,
  Paper,
  Autocomplete,
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
import {
  addHealthIssue,
  fetchHealthIssues,
  patientOnboarding,
} from "../../../store/actions";
import { debounce } from "lodash";

/**
 * PatientOnBoarding Component
 *
 * A form to collect patient health data for onboarding.
 *
 * @component
 * @memberof src.components.private.onBoarding.PatientOnBoarding
 * @returns {JSX.Element} The patient questionnaire form component.
 */
const PatientOnBoarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const { healthIssues, loading: healthIssuesLoading } = useSelector(
    (state) => state.healthIssues
  );

  const { loading, error, patientData } = useSelector(
    (state) => state.onBoarding
  );

  /**
   * Patient questionnaire form state.
   *
   * @type {Object}
   * @property {string} name - Patient's full name.
   * @property {string} age - Patient's age.
   * @property {string} sex - Patient's gender.
   * @property {string} height - Patient's height in cm.
   * @property {string} weight - Patient's weight in kg.
   * @property {string[]} healthIssues - Patient's health issues.
   */
  const [formData, setFormData] = useState({
    name: user.fullName || "",
    age: "",
    sex: "",
    height: "",
    weight: "",
    healthIssues: [],
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Debounced function to fetch health issues
  const fetchIssuesDebounced = useCallback(
    debounce((query) => {
      if (query.length >= 3) {
        dispatch(fetchHealthIssues({ query, token: user.token }));
      }
    }, 300),
    []
  );

  /**
   * Handles search input changes and fetches health issues matching the query.
   *
   * @function
   * @memberof src.components.private.onBoarding.PatientOnBoarding
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   * @param {string} value - The search query input value.
   * @returns {void}
   */
  const handleSearchChange = (event, value) => {
    setSearchTerm(value);
    fetchIssuesDebounced(value);
  };

  // Handle selection of a health issue
  const handleHealthIssueSelect = (event, value) => {
    const newIssue = value[value.length - 1];

    if (!healthIssues.includes(newIssue)) {
      dispatch(addHealthIssue({ newIssue, token: user.token }));
    }

    setFormData({ ...formData, healthIssues: value });
  };

  /**
   * Handles input changes and updates state.
   *
   * @function
   * @memberof src.components.private.onBoarding.PatientOnBoarding
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }, navigate);
  };

  /**
   * Handles form submission by dispatching patient onboarding action.
   *
   * @function
   * @memberof src.components.private.onBoarding.PatientOnBoarding
   */
  const handleSubmit = () => {
    dispatch(patientOnboarding({ formData, token: user.token }));
  };

  /**
   * Selects the appropriate Lottie animation based on age and gender.
   *
   * @function
   * @memberof src.components.private.onBoarding.PatientOnBoarding
   * @returns {Object} The corresponding animation data.
   */
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
          <Autocomplete
            multiple
            style={{ marginTop: 16 }}
            freeSolo
            loading={healthIssuesLoading}
            options={healthIssues.map((issue) => issue.health_issue)}
            value={formData.healthIssues}
            onChange={handleHealthIssueSelect}
            onInputChange={handleSearchChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Health Issues" />
            )}
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

export default PatientOnBoarding;
