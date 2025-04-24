/**
 * @file Profile Component
 *
 *
 * @namespace src.components.private.profile
 * @memberof src.components.private
 *
 * This component renders the profile page based on the user's role (doctor or patient).
 * It handles authentication, profile data fetching, and conditional rendering of
 * DoctorProfileView or PatientProfileView components. For doctors, it also fetches
 * nearby hospitals using geolocation and a list of doctors.
 */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors, fetchHospitals, fetchProfile } from "../../../store/actions";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import PatientProfileView from "./PatientProfileView.jsx";
import DoctorProfileView from "./DoctorProfileView.jsx";

/**
 * @file Profile Page Component
 *
 * @namespace src.components.private.profile
 * @memberof src.components.private
 *
 * This component renders the profile page based on the user's role (doctor or patient).
 * It handles authentication, profile data fetching, and conditional rendering of
 * DoctorProfileView or PatientProfileView components. For doctors, it also fetches
 * nearby hospitals using geolocation and a list of doctors.
 *
 * @component
 * @returns {JSX.Element} - The profile view for the authenticated user.
 *
 * @example
 * <ProfilePage />
 */

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData, loading } = useSelector((state) => state.profile);
  const token = useSelector((state) => state.auth?.token);
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!userData) {
      dispatch(fetchProfile({ token, fromProfilePage: true }));
    }
  }, []);

  useEffect(() => {
    if (userData?.role === "doctor") {
      console.log({ userData })
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          dispatch(fetchHospitals({ lat: latitude, long: longitude }));
        },
        () => console.error("Location access denied for hospital fetch"),
        { enableHighAccuracy: true }
      );
      dispatch(fetchDoctors({ token }))
    }
  }, [userData?.role, dispatch]);

  if (loading || !userData) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const role = userData.role;

  return role === "doctor" ? (
    <DoctorProfileView token={token} />
  ) : (
    <PatientProfileView userData={userData} />
  );
};

export default ProfilePage;
