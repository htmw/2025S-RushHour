import React from "react";
import { Typography } from "@mui/material";
import DoctorLayout from "./DoctorLayout";
import { useSelector } from "react-redux";

const DoctorHomePage = () => {
  const { fullName } = useSelector((state) => state.auth);
  return (
    <DoctorLayout>
      <Typography variant="h4" className="patient-home-title">
        Welcome, {fullName}!
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Here you can access your appointments, manage patient records, and view
        your schedule.
      </Typography>
    </DoctorLayout>
  );
};

export default DoctorHomePage;
