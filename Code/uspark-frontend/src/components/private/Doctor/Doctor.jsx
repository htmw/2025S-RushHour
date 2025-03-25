/**
 * @file Doctor homepage component.
 *
 * Provides an overview for doctors, allowing them to manage appointments, view schedules,
 * and access patient records.
 *
 * @namespace src.components.private.Doctor.Doctor
 * @memberof src.components.private
 */

import React from "react";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

/**
 * Doctor Component
 *
 * Displays the main dashboard for doctors after login.
 *
 * @component
 * @memberof src.components.private.Doctor.Doctor
 * @returns {JSX.Element} The doctor's home page with dashboard features.
 */
const Doctor = () => {
  /** @type {string} */
  const { fullName } = useSelector((state) => state.auth);

  return (
    <>
      <Typography variant="h4" className="doctor-home-title">
        Welcome, {fullName}!
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Here you can access your appointments, manage patient records, and view
        your schedule.
      </Typography>
    </>
  );
};

export default Doctor;
