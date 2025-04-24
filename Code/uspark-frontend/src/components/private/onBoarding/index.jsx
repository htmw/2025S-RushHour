/**
 * @file Onboarding component for new users.
 *
 * Directs users to the appropriate onboarding flow based on their selected role (doctor or patient).
 *
 * @namespace src.components.private.onBoarding
 * @memberof src.components.private
 */

import React, { useEffect, Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

// Lazy-load onboarding steps to improve performance
const RoleSelection = lazy(() => import("./RoleSelection"));
const PatientOnBoarding = lazy(() => import("./PatientOnBoarding"));
const DoctorOnBoarding = lazy(() => import("./DoctorOnBoarding"));

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

  /** @type {boolean} */
  const authLoading = useSelector((state) => state.auth.loading);

  /**
   * Redirect onboarded users to the dashboard.
   *
   * @effect Runs when `userOnboarded` changes.
   */
  useEffect(() => {
    if (userOnboarded) {
      navigate("/dashboard");
    }
  }, [userOnboarded, navigate]);

  // Show spinner while checking auth status or lazy-loading
  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      }
    >
      {!role && <RoleSelection />}
      {role === "patient" && <PatientOnBoarding />}
      {role === "doctor" && <DoctorOnBoarding />}
    </Suspense>
  );
};

export default Onboarding;
