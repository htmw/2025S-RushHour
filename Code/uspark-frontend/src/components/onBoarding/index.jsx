// src/components/Onboarding/Onboarding.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import RoleSelection from "./RoleSelection";
import PatientQuestionnaire from "./PatientOnboarding/PatientQuestionnaire";
import DoctorQuestionnaire from "./DoctorOnboarding/DoctorQuestionnaire";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();
  const role = useSelector((state) => state.onBoarding.role);
  const userOnboarded = useSelector((state) => state.auth.isOnboarded);
  // useEffect(() => {
  //   if (userOnboarded) {
  //     history.push("/dashboard");
  //   }
  // }, [userOnboarded]);
  return (
    <div>
      {!role && <RoleSelection />}
      {role === "patient" && <PatientQuestionnaire />}
      {role === "doctor" && <DoctorQuestionnaire />}
    </div>
  );
};

export default Onboarding;
