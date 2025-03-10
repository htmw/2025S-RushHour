/**
 * @file Home Component
 *
 *
 * @namespace src.components.private.Home
 * @memberof src.components.private
 *
 * This component handles redirection logic based on the user's authentication
 * and onboarding status. It checks if the user is onboarded and authenticated,
 * and navigates them to the appropriate page.
 */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../public/Suspense";

/**
 * Handles redirection logic based on the user's authentication and onboarding status.
 * @function
 * @memberof src.components.private.Home
 * @returns {JSX.Element} - Renders a loading spinner while handling redirection.
 * @example
 * <Home />
 */
const Home = () => {
  const navigate = useNavigate();

  /**
   * Retrieves authentication and onboarding status from Redux state.
   * @type {{ isOnboarded: boolean, token: string | null }}
   */
  const { isOnboarded, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOnboarded && token) {
      navigate("/dashboard");
    } else if (!isOnboarded && token) {
      navigate("/onBoarding");
    } else {
      navigate("/login");
    }
  }, [isOnboarded, token, navigate]);

  return <LoadingSpinner />;
};

export default Home;
