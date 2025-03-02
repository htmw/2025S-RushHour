import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../store/actions";
import { useNavigate } from "react-router-dom";
import PatientLayout from "../../pages/PatLayout";

const PatientProfile = () => {
  const navigate = useNavigate();
  const { userData, loading } = useSelector((state) => state.dashboard);
  const token = useSelector((state) => state.auth?.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(fetchDashboard({ token }));
    }
  }, [token]);

  if (loading) {
    return <PatientLayout><div>Loading...</div></PatientLayout>;
  }

  return (
    <PatientLayout>
      <Typography variant="h5">Patient Profile</Typography>
      <Typography>Age: {userData.age}</Typography>
      <Typography>Sex: {userData.sex}</Typography>
      <Typography>Height: {userData.height} cm</Typography>
      <Typography>Weight: {userData.weight} kg</Typography>
      <Typography>
        Health Issues: {userData.healthIssues || "N/A"}
      </Typography>
    </PatientLayout>
  );
};

export default PatientProfile;
