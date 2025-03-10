/**
 * @file OneCard Component
 *
 *
 * @namespace src.components.private.Patient.OneCard
 * @memberof src.components.private.Patient
 * This component provides a secure way for patients to access their profile
 * information using a PIN-based authentication system. Features include:
 * - PIN setup and storage in localStorage.
 * - Secure unlocking of patient details using the stored PIN.
 * - A zoom-in animation effect upon successful PIN entry.
 * - Display of patient profile details and an insurance card.
 */

import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import "../../../css/OneCard.css";
import InsuranceCard from "./InsuranceCard";

/**

 *
 * @component
 * @memberof src.components.private.Patient.OneCard
 * @returns {JSX.Element} - The OneCard component displaying secure patient information.
 *
 * @example
 * <OneCard />
 * */
const OneCard = () => {
  /**
   * State for user-entered PIN.
   * @property {string} pin - PIN input value and setter function.
   */
  const [pin, setPin] = useState("");

  /**
   * State for stored PIN retrieved from localStorage.
   * @property {string} storedPin - The stored PIN value.
   */
  const [storedPin, setStoredPin] = useState(
    localStorage.getItem("userPin") || ""
  );

  /**
   * State to control card visibility after PIN verification.
   * @property {boolean} showCard - Determines if the patient card is displayed.
   */
  const [showCard, setShowCard] = useState(false);

  /**
   * State to control zoom-in animation effect when unlocking.
   * @property {boolean} isZoomed - Determines if the zoom animation is active.
   */
  const [isZoomed, setIsZoomed] = useState(false);

  /**
   * Retrieves the patient's full name from Redux state.
   * @property {{ fullName: string }}
   */
  const { fullName } = useSelector((state) => state.auth);

  /**
   * Retrieves user-specific data from Redux state.
   * @property {{ userData: Object }}
   */
  const { userData } = useSelector((state) => state.dashboard);

  /**
   * Handles setting up a 4-digit PIN and storing it in localStorage.
   */
  const handlePinSetup = () => {
    if (pin.length === 4) {
      localStorage.setItem("userPin", pin);
      setStoredPin(pin);
      alert("PIN set successfully!");
      setPin("");
    } else {
      alert("Please enter a 4-digit PIN.");
    }
  };

  /**
   * Handles PIN submission and unlocks the patient card if correct.
   */
  const handlePinSubmit = () => {
    if (pin === storedPin) {
      setShowCard(true);
      setPin("");
      setIsZoomed(true);
      setTimeout(() => setIsZoomed(false), 300);
    } else {
      alert("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  return (
    <div className={`background-container ${showCard ? "blurred" : ""}`}>
      <motion.div className="One-Content">
        {!storedPin && (
          <Card className="patient-card">
            <CardContent>
              <Typography variant="h6">Set Your PIN</Typography>
              <TextField
                label="Enter a 4-digit PIN"
                type="password"
                variant="outlined"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePinSetup}
              >
                Set PIN
              </Button>
            </CardContent>
          </Card>
        )}
        {storedPin && !showCard && (
          <Card
            className="patient-card"
            component={motion.div}
            whileHover={{ scale: 1.05 }}
          >
            <CardContent>
              <Typography variant="h6">One Card</Typography>
              <TextField
                label="Enter PIN"
                type="password"
                variant="outlined"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePinSubmit}
              >
                Unlock
              </Button>
            </CardContent>
          </Card>
        )}
        {showCard && (
          <motion.div
            className="patient-profile-card"
            initial={{ scale: 0 }}
            animate={isZoomed ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="One-Content">
              <CardContent>
                <Typography variant="h6">Patient Profile</Typography>
                <Typography>Name: {fullName}</Typography>
                <Typography>Age: {userData.age}</Typography>
                <Typography>Gender: {userData.sex}</Typography>
                <Typography>Height: {userData.height}</Typography>
                <Typography>Weight: {userData.weight}</Typography>
                <Typography>
                  Health Issues: {userData.healthIssues || "N/A"}
                </Typography>
              </CardContent>
              <InsuranceCard />
            </div>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowCard(false)}
            >
              Close
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default OneCard;
