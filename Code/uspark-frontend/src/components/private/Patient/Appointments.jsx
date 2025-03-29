import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../css/Appointments.css"; // Import the CSS file for styling

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/appointments"
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/appointments/${id}`);
      setAppointments(
        appointments.filter((appointment) => appointment._id !== id)
      );
    } catch (error) {
      console.error("Error canceling appointment:", error);
      setError("Failed to cancel the appointment.");
    }
  };

  const handleRescheduleAppointment = async (id) => {
    if (!newDate) return alert("Please select a new date.");
    try {
      await axios.put(`http://localhost:5001/api/appointments/${id}`, {
        date: newDate,
      });
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, date: newDate }
            : appointment
        )
      );
      setEditingAppointment(null);
      setNewDate("");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      setError("Failed to reschedule the appointment.");
    }
  };

  return (
    <div className="appointments-container">
      <h2>Your Appointments</h2>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length > 0 ? (
        <div className="appointments-grid">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <h3>{appointment.name}</h3>
              <p className="appointment-date">📅 {appointment.date}</p>
              <p className="hospital-name">🏥 {appointment.hospitalName}</p>
              <p className="hospital-address">
                📍 {appointment.hospitalAddress}
              </p>
              <p className="appointment-reason">📝 {appointment.reason}</p>

              {editingAppointment === appointment._id ? (
                <div className="reschedule-section">
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="date-input"
                  />
                  <button
                    className="save-btn"
                    onClick={() => handleRescheduleAppointment(appointment._id)}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setEditingAppointment(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    className="edit-btn"
                    onClick={() => setEditingAppointment(appointment._id)}
                  >
                    Reschedule
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleCancelAppointment(appointment._id)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
};

export default AppointmentsPage;
