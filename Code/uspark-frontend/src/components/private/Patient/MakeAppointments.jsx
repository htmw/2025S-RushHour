import React, { useState } from "react";
import { hospitalsApi } from "../../../store/apis"; // Ensure you have this API set up
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import "../../../css/MakeAppointments.css";

const MakeAppointments = () => {
  const [hospitals, setHospitals] = useState([]); // List of hospitals
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message
  const [selectedHospital, setSelectedHospital] = useState(null); // Selected hospital for appointment
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: "",
    date: "",
    reason: "",
    email: "",
  }); // Appointment details
  const [submitting, setSubmitting] = useState(false); // State for submission loading

  // Fetch hospitals based on user's location
  const fetchHospitals = async (latitude, longitude) => {
    setLoading(true);
    setError("");

    try {
      const response = await hospitalsApi(latitude, longitude);
      setHospitals(response.data.results);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch hospitals. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle finding hospitals near user
  const handleFindHospitals = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchHospitals(latitude, longitude);
      },
      () => {
        setError("Error getting location. Please allow location access.");
      },
      { enableHighAccuracy: true }
    );
  };

  // Handle booking appointment for a selected hospital
  const handleBookAppointment = (hospital) => {
    setSelectedHospital(hospital);
  };

  // Submit appointment details
  const handleSubmitAppointment = async () => {
    if (
      !appointmentDetails.name ||
      !appointmentDetails.date ||
      !appointmentDetails.reason ||
      !appointmentDetails.email ||
      !selectedHospital
    ) {
      setError("Please fill all fields and select a hospital.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5001/api/appointments",
        {
          hospitalName: selectedHospital.name,
          hospitalAddress: selectedHospital.vicinity,
          ...appointmentDetails,
        }
      );

      alert(response.data.message); // Show success message
      setSelectedHospital(null);
      setAppointmentDetails({ name: "", date: "", reason: "", email: "" });
    } catch (err) {
      setError("Failed to book appointment. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      component={Paper}
      elevation={3}
      sx={{ p: 3, maxWidth: 600, mt: 5 }}
    >
      <Typography variant="h5" gutterBottom>
        Book an Appointment
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<FontAwesomeIcon icon={faMapMarkerAlt} />}
        onClick={handleFindHospitals}
      >
        Find Hospitals Near Me
      </Button>

      {loading && (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />
      )}

      <Typography variant="h6" sx={{ mt: 3 }}>
        Available Hospitals
      </Typography>

      {hospitals.length > 0 ? (
        <ul className="hospital-list">
          {hospitals.map((hospital, index) => (
            <li key={index} className="hospital-item">
              <strong>{hospital.name}</strong> - {hospital.vicinity}
              <Button
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
                onClick={() => handleBookAppointment(hospital)}
              >
                Book Appointment
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <Typography>No hospitals found.</Typography>
      )}

      {/* Appointment Modal */}
      <Dialog
        open={Boolean(selectedHospital)}
        onClose={() => setSelectedHospital(null)}
        fullWidth
      >
        <DialogTitle>Book Appointment at {selectedHospital?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Your Name"
            variant="outlined"
            margin="normal"
            value={appointmentDetails.name}
            onChange={(e) =>
              setAppointmentDetails({
                ...appointmentDetails,
                name: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Your Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={appointmentDetails.email}
            onChange={(e) =>
              setAppointmentDetails({
                ...appointmentDetails,
                email: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={appointmentDetails.date}
            onChange={(e) =>
              setAppointmentDetails({
                ...appointmentDetails,
                date: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Reason for Appointment"
            variant="outlined"
            margin="normal"
            multiline
            rows={2}
            value={appointmentDetails.reason}
            onChange={(e) =>
              setAppointmentDetails({
                ...appointmentDetails,
                reason: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedHospital(null)} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitAppointment}
            disabled={submitting}
          >
            {submitting ? (
              <CircularProgress size={24} />
            ) : (
              "Confirm Appointment"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MakeAppointments;
