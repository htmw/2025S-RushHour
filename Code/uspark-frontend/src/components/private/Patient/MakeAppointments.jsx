import React, { useState } from "react";
import { hospitalsApi } from "../../../store/apis"; // Ensure you have this API set up
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons"; // Import the icon you want to use
import "../../../css/MakeAppointments.css"; // Import the CSS file for styling

const MakeAppointments = () => {
  const [hospitals, setHospitals] = useState([]); // List of hospitals
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message
  const [selectedHospital, setSelectedHospital] = useState(null); // Selected hospital for appointment
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: "",
    date: "",
    reason: "",
    email: "", // Add email to the appointment details
  }); // Appointment details

  // Fetch hospitals based on latitude and longitude
  const fetchHospitals = async (latitude, longitude) => {
    setLoading(true);
    setError("");

    try {
      const response = await hospitalsApi(latitude, longitude);
      setHospitals(response.data.results);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch hospitals.");
    } finally {
      setLoading(false);
    }
  };

  // Handle finding doctors by getting user's location
  const handleFindDoctors = () => {
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
      !appointmentDetails.email || // Check for email
      !selectedHospital
    ) {
      setError("Please fill all fields and select a hospital.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/appointments", {
        hospitalName: selectedHospital.name,
        hospitalAddress: selectedHospital.vicinity,
        ...appointmentDetails,
      });
      alert("Appointment booked successfully!");
      setSelectedHospital(null);
      setAppointmentDetails({ name: "", date: "", reason: "", email: "" }); // Reset all fields
    } catch (err) {
      setError("Failed to book appointment. Try again.");
    }
  };

  return (
    <div className="make-appointments-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Available Hospitals</h2>
      <ul>
        {hospitals.length > 0 ? (
          hospitals.map((hospital, index) => (
            <li key={index}>
              <strong>{hospital.name}</strong> - {hospital.vicinity}
              <button onClick={() => handleBookAppointment(hospital)}>
                Book Appointment
              </button>
            </li>
          ))
        ) : (
          <p>No hospitals found.</p>
        )}
      </ul>

      {/* Appointment Modal */}
      {selectedHospital && (
        <div className="modal">
          <div className="modal-content">
            <h2>Book Appointment at {selectedHospital.name}</h2>
            <input
              type="text"
              placeholder="Your Name"
              value={appointmentDetails.name}
              onChange={(e) =>
                setAppointmentDetails({
                  ...appointmentDetails,
                  name: e.target.value,
                })
              }
            />
            <input
              type="email"
              placeholder="Your Email"
              value={appointmentDetails.email}
              onChange={(e) =>
                setAppointmentDetails({
                  ...appointmentDetails,
                  email: e.target.value,
                })
              }
            />
            <input
              type="date"
              value={appointmentDetails.date}
              onChange={(e) =>
                setAppointmentDetails({
                  ...appointmentDetails,
                  date: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Reason for Appointment"
              value={appointmentDetails.reason}
              onChange={(e) =>
                setAppointmentDetails({
                  ...appointmentDetails,
                  reason: e.target.value,
                })
              }
            />
            <div className="modal-buttons">
              <button onClick={handleSubmitAppointment}>
                Confirm Appointment
              </button>
              <button onClick={() => setSelectedHospital(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chatbot-Like Button with Icon */}
      <button className="chatbot-button" onClick={handleFindDoctors}>
        <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" /> Find Doctors Near Me
      </button>
    </div>
  );
};

export default MakeAppointments;
