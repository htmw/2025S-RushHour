/**
 * @file PatientHomePage Component
 *
 *
 * @namespace src.components.private.Patient
 * @memberof src.components.private
 * This component serves as the homepage for patients, providing:
 * - A personalized greeting with the patient's full name.
 * - A rotating health fact that updates every 30 minutes.
 * - Quick access to medical records, appointment booking, and health management.
 * - Integration with news, initial assessments, and a chatbot for patient assistance.
 *
 */

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import "../../../css/PatientHomePage.css";
import health from "./Fact.js";
import OneCard from "./OneCard";
import { motion } from "framer-motion";
import MedicalNews from "./News";
import InitialAssessmentCard from "./InitialAssesment";
import Chatbot from "../Chatbot/Chatbox";

/**
 * Array of health facts imported from Fact.js
 * @property {string[]}
 */
const healthFacts = health;

/**

 * @component
 * @memberof src.components.private.Patient.Patient
 * @returns {JSX.Element} - The PatientHomePage component displaying patient-related information.
 *
 * @example
 * <PatientHomePage />
 * */
const PatientHomePage = () => {
  /**
   * Stores the currently displayed health fact.
   * @property {string} healthFact - Current health fact and setter function.
   */
  const [healthFact, setHealthFact] = useState(healthFacts[0]);

  /**
   * Retrieves the full name of the authenticated user from Redux state.
   * @property {{ fullName: string }}
   */
  const { fullName } = useSelector((state) => state.auth);

  /**
   * Generates a new random health fact and updates the state.
   */
  const getNewHealthFact = () => {
    const nextIndex = Math.floor(Math.random() * healthFacts.length);
    setHealthFact(healthFacts[nextIndex]);
  };

  /**
   * useEffect hook to set an initial health fact and update it every 30 minutes.
   * Clears the interval on component unmount.
   */
  useEffect(() => {
    getNewHealthFact();
    const interval = setInterval(getNewHealthFact, 1800000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="patient-home-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div>
        <Typography
          variant="h4"
          className="patient-home-title"
          data-cy="dashboard-welcome"
        >
          Welcome, {fullName}!
        </Typography>
        <Typography variant="body1" className="patient-home-subtitle">
          Access your medical records, book appointments, and manage your health
          data with ease.
        </Typography>
        <motion.div className="health-fact-box">
          <Typography variant="h6">Health Tip of the Moment:</Typography>
          <Typography variant="body2">{healthFact}</Typography>
        </motion.div>
        <motion.div className="newscard">
          <InitialAssessmentCard />
          <MedicalNews />
        </motion.div>

        <OneCard />
      </motion.div>
      <Chatbot />
    </motion.div>
  );
};

export default PatientHomePage;
