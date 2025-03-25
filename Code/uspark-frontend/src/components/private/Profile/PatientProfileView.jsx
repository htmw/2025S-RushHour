import React, { useState } from "react";
import {
  TextField,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import ImageUpload from "../Dashboard/Imageupload.jsx";
import ResponsiveField from "../../../utils/components/ResponsiveField.jsx";
const PatientProfileView = ({ userData }) => {
  const [formData, setFormData] = useState({
    age: userData.age || "",
    sex: userData.sex || "",
    height: userData.height || "",
    weight: userData.weight || "",
    healthIssues: userData.healthIssues?.join(", ") || "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    console.log("Saving patient profile:", formData);
    // Dispatch update action if needed
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: "10px", width: "99%" }}>
      <ImageUpload userData={userData} />
      <Typography variant="h5" gutterBottom>
        Patient Profile
      </Typography>

      <Stack spacing={2} mt={2}>
        <ResponsiveField
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
        />
        <ResponsiveField
          label="Sex"
          name="sex"
          value={formData.sex}
          onChange={handleChange}
        />
        <ResponsiveField
          label="Height (cm)"
          name="height"
          type="number"
          value={formData.height}
          onChange={handleChange}
        />
        <ResponsiveField
          label="Weight (kg)"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
        />
        <ResponsiveField
          label="Health Issues"
          name="healthIssues"
          value={formData.healthIssues}
          onChange={handleChange}
        />
      </Stack>

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 3 }}
        onClick={handleSave}
      >
        Save Changes
      </Button>
    </Paper>
  );
};

export default PatientProfileView;
