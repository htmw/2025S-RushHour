/**
 * @file PatientProfileView Component
 *
 * @namespace src.components.private.profile.PatientProfileView
 * @memberof src.components.private.profile
 *
 * This component renders and manages the patient profile section. It includes
 * editable fields for age, sex, height, weight, and health issues, along with
 * integrated components for uploading profile images, managing insurance details,
 * and viewing medical history. It supports live health issue search and creation.
 */

import React, { useState } from "react";
import {
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  MenuItem,
  Chip,
  Autocomplete,
} from "@mui/material";
import ImageUpload from "../Dashboard/Imageupload.jsx";
import CreateInsuranceDetails from "./CreateUserInsuranceDetails.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePatientProfile,
  fetchHealthIssues,
  addHealthIssue,
} from "../../../store/actions";
import { debounce } from "lodash";
import ResponsiveField from "../../../utils/components/ResponsiveField.jsx";
import MedicalHistory from "./MedicalHistory.jsx";


/**
 * PatientProfileView Component
 *
 * @memberof src.components.private.profile.PatientProfileView
 *
 * @param {Object} props
 * @param {Object} props.userData - The authenticated patient's profile data.
 *
 * @returns {JSX.Element} - Renders a patient profile form with fields for personal
 * and medical details, image upload, insurance entry, and medical history tracking.
 *
 * @example
 * <PatientProfileView userData={userData} />
 */

const PatientProfileView = ({ userData }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { healthIssues, loading: healthIssuesLoading } = useSelector(
    (state) => state.healthIssues
  );

  const [formData, setFormData] = useState({
    age: userData.age || "",
    sex: userData.sex || "",
    height: userData.height || "",
    weight: userData.weight || "",
    healthIssues: userData.healthIssues || [],
  });

  const fetchIssuesDebounced = debounce((query) => {
    if (query.length >= 3) {
      dispatch(fetchHealthIssues({ query, token }));
    }
  }, 300);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHealthIssueSelect = (event, value) => {
    const newIssue = value[value.length - 1];
    const isAlreadyAdded = healthIssues.some(
      (issue) => issue.health_issue === newIssue
    );

    if (!isAlreadyAdded && typeof newIssue === "string") {
      dispatch(addHealthIssue({ health_issue: newIssue, token }));
    }

    setFormData({ ...formData, healthIssues: value });
  };

  const handleSearchChange = (event, value) => {
    fetchIssuesDebounced(value);
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      healthIssues: Array.isArray(formData.healthIssues)
        ? formData.healthIssues
        : formData.healthIssues.split(",").map((s) => s.trim()),
      token,
    };

    dispatch(updatePatientProfile(payload));
  };
  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mt: "10px", width: "99%" }}>
        <ImageUpload userData={userData} fromProfilePage />
        <Typography variant="h5" gutterBottom data-cy="patient-profile-title">
          Patient Profile
        </Typography>

        <Stack spacing={2} mt={2}>
          <ResponsiveField
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            inputProps={{ "data-cy": "patient-age" }}
          />
          <ResponsiveField
            label="Sex"
            name="sex"
            select
            fullWidth
            value={formData.sex}
            onChange={handleChange}
            inputProps={{ "data-cy": "patient-sex" }}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          >
          </ResponsiveField>
          <ResponsiveField
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleChange}
            fullWidth
            inputProps={{ "data-cy": "patient-height" }}
          />
          <ResponsiveField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            fullWidth
            inputProps={{ "data-cy": "patient-weight" }}
          />
          <Autocomplete
            multiple
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
            data-cy="patient-health-issues"
            renderInput={(params) => (
              <ResponsiveField {...params} label="Health Issues" />
            )}
          />
        </Stack>



        <Button
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
          onClick={handleSave}
          data-cy="patient-save"
        >
          Save Changes
        </Button>
      </Paper>
      <CreateInsuranceDetails userData={userData} />
      <MedicalHistory showActions={false} />

    </>
  );
};

export default PatientProfileView;
