import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import PatientLayout from "./PatLayout";
import "../../css/PatientHomePage.css"
import health from "../../components/Fact";
import OneCard from "./OneCard";
import { motion } from "framer-motion";
import MedicalNews from "./News";
import InitialAssessmentCard from "./InitialAssesment";


const healthFacts = health;

const PatientHomePage = () => {
  const [healthFact, setHealthFact] = useState(healthFacts[0]);
  const { fullName } = useSelector((state) => state.auth);

  const getNewHealthFact = () => {
    const nextIndex = Math.floor(Math.random() * healthFacts.length);
    setHealthFact(healthFacts[nextIndex]);
  };

  useEffect(() => {
    getNewHealthFact();
    const interval = setInterval(getNewHealthFact, 1800000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PatientLayout>
      <motion.div
        className="patient-home-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div>
          <Typography variant="h4" className="patient-home-title">
            Welcome, {fullName}!
          </Typography>
          <Typography variant="body1" className="patient-home-subtitle">
            Access your medical records, book appointments, and manage your
            health data with ease.
          </Typography>
          <motion.div className="newscard">
            <motion.div className="health-fact-box">
              <Typography variant="h6">Health Tip of the Moment:</Typography>
              <Typography variant="body2">{healthFact}</Typography>
            </motion.div>
            <InitialAssessmentCard />
              <MedicalNews />
            
          </motion.div>
          
          <OneCard />
        </motion.div>
      </motion.div>
    </PatientLayout>
  );
};

export default PatientHomePage;
