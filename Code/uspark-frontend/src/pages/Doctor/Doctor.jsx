import React from "react";
import { Typography } from "@mui/material";
import DoctorLayout from "./DoctorLayout";

const DoctorHomePage = () => {
  return (
    <DoctorLayout>
      <Typography variant="h4">Welcome to Your Doctor Dashboard</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Here you can access your appointments, manage patient records, and view your schedule.
      </Typography>
    </DoctorLayout>
  );
};

export default DoctorHomePage;
