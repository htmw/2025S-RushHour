import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"; // Import the icon you want to use


const FloatingFindDoctorsButton = () => {
  const navigate = useNavigate(); // Initialize navigate

  // Handle navigation to findahosp route
  const handleFindDoctors = () => {
    navigate("/findahosp");
  };

  return (
    <button className="floating-button" onClick={handleFindDoctors}>
      
    </button>
  );
};

export default FloatingFindDoctorsButton;
