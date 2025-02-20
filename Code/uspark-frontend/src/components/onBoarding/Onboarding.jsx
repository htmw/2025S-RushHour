// src/components/Onboarding/Onboarding.jsx
import React from "react";
import { useSelector } from "react-redux";
import RoleSelection from "./RoleSelection";
import PatientQuestionnaire from "./PatientOnboarding/PatientQuestionnaire";
import DoctorQuestionnaire from "./DoctorOnboarding/DoctorQuestionnaire";

const Onboarding = () => {
  const role = useSelector((state) => state.onboarding.role);

  return (
    <div>
      {!role && <RoleSelection />}
      {role === "patient" && <PatientQuestionnaire />}
      {role === "doctor" && <DoctorQuestionnaire />}
    </div>
  );
};

export default Onboarding;
