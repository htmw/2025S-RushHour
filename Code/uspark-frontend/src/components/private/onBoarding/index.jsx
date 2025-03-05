// src/components/Onboarding/Onboarding.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import RoleSelection from "./RoleSelection";
import PatientOnBoarding from "./PatientOnBoarding";
import DoctorOnBoarding from "./DoctorOnBoarding";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.onBoarding.role);
  const userOnboarded = useSelector((state) => state.auth.isOnboarded);
  useEffect(() => {
    if (userOnboarded) {
      navigate("/dashboard");
    }
  }, [userOnboarded]);
  return (
    <div>
      {!role && <RoleSelection />}
      {role === "patient" && <PatientOnBoarding />}
      {role === "doctor" && <DoctorOnBoarding />}
    </div>
  );
};

export default Onboarding;
