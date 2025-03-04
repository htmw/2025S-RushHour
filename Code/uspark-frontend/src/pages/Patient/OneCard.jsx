import PatientLayout from "./PatLayout";
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
import "../../css/OneCard.css";
import InsuranceCard from "./InsuranceCard";

const OneCard = () => {
  const [pin, setPin] = useState("");
  const [storedPin, setStoredPin] = useState(
    localStorage.getItem("userPin") || ""
  );
  const [showCard, setShowCard] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const { fullName } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.dashboard);

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
        {" "}
        {/* Added one-card-content class */}
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
