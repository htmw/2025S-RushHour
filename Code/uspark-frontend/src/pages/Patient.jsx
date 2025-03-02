import React from "react";
import { Typography } from "@mui/material";
import PatientLayout from "./PatLayout";

const PatientHomePage = () => {
  return (
    <PatientLayout>
      <Typography variant="h4">Welcome to Your Patient Dashboard</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Here you can access your medical records, book appointments, and manage your health data.
      </Typography>
    </PatientLayout>
  );
};

export default PatientHomePage;
