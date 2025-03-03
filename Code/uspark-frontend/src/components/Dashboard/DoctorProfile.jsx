import React,{useEffect}  from "react";
import { Typography } from "@mui/material";
import {useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../../store/actions";
import DoctorLayout from "../../pages/Doctor/DoctorLayout";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.dashboard);
  const token = useSelector((state) => state.auth?.token);
  useEffect(()=>{
      if(!token) {
        navigate('/login')
      }
      else{
        dispatch(fetchDashboard({token}))
      }
   },[token])
   if(loading){
    return <div>Loading...</div>
   }
  return (
    <>
    <DoctorLayout>
      <Typography variant="h5">Doctor Profile</Typography>
      <Typography>Specialization: {userData.specialization}</Typography>
      <Typography>Experience: {userData.experience} years</Typography>
      <Typography>
        Certifications: {userData.certifications || "N/A"}
      </Typography>
      </DoctorLayout>
    </>
  );
};

export default DoctorProfile;
