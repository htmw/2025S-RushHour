import React from "react";
import { Typography } from "@mui/material";

const DoctorProfile = ({ userData }) => {
  return (
    <>
      <Typography variant="h5">Doctor Profile</Typography>
      <Typography>Specialization: {userData.specialization}</Typography>
      <Typography>Experience: {userData.experience} years</Typography>
      <Typography>
        Certifications: {userData.certifications || "N/A"}
      </Typography>
    </>
  );
};

export default DoctorProfile;
