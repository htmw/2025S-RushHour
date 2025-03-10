/**
 * @file Onboarding component for new users.
 *
 * Directs users to the appropriate onboarding flow based on their selected role (doctor or patient).
 *
 * @namespace src.components.private.onBoarding
 * @memberof src.components.private
 */

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import RoleSelection from "./RoleSelection";
import PatientOnBoarding from "./PatientOnBoarding";
import DoctorOnBoarding from "./DoctorOnBoarding";
import { useNavigate } from "react-router-dom";

/**
 * Onboarding Component
 *
 * Controls the onboarding process by displaying either the role selection, patient onboarding,
 * or doctor onboarding component based on the user's selection.
 *
 * @component
 * @memberof src.components.private.onBoarding
 * @returns {JSX.Element} The onboarding flow component.
 */
const Onboarding = () => {
  const navigate = useNavigate();

  /** @type {string|null} */
  const role = useSelector((state) => state.onBoarding.role);

  /** @type {boolean} */
  const userOnboarded = useSelector((state) => state.auth.isOnboarded);

  /**
   * Redirects onboarded users to the dashboard.
   *
   * @function
   * @memberof src.components.private.onBoarding
   * @effect Runs when `userOnboarded` changes.
   */
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
