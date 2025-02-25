import React from "react";
import { Typography } from "@mui/material";

const PatientProfile = ({ userData }) => {
  return (
    <>
      <Typography variant="h5">Patient Profile</Typography>
      <Typography>Age: {userData.age}</Typography>
      <Typography>Sex: {userData.sex}</Typography>
      <Typography>Height: {userData.height} cm</Typography>
      <Typography>Weight: {userData.weight} kg</Typography>
      
      <Typography>
        Health Issues: {userData.healthIssues || "N/A"}
      </Typography>
    </>
  );
};

export default PatientProfile;
