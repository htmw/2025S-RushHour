import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../../store/actions";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import PatientProfileView from "./PatientProfileView.jsx";
import DoctorProfileView from "./DoctorProfileView.jsx";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData, loading } = useSelector((state) => state.dashboard);
  const token = useSelector((state) => state.auth?.token);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(fetchDashboard({ token }));
    }
  }, [token]);

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
