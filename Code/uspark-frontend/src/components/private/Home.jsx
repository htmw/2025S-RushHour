import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../public/Suspense";
const AboutUspark = () => {
  const navigate = useNavigate();
  const { isOnboarded, token } = useSelector((state) => state.auth);
  console.log({ isOnboarded, token });

  useEffect(() => {
    if (isOnboarded && token) {
      navigate("/dashboard");
    } else if (!isOnboarded && token) {
      navigate("/onBoarding");
    } else {
      navigate("/login");
    }
  }, [isOnboarded, token]);
  return <LoadingSpinner />;
};

export default AboutUspark;
