import React, { useState, useEffect } from "react";
import {
  Typography, Container, Paper, CircularProgress, Dialog,
  DialogActions, DialogContent, DialogTitle, Grid, Box, IconButton, Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import ResponsiveField from "../../../utils/components/ResponsiveField";
import { fetchDoctors, createAppointment } from "../../../store/actions";
import SearchIcon from "@mui/icons-material/Search";
import useDebounce from "../../../utils/hooks/useDebounce";

const MakeAppointments = () => {
  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector(state => state.makeAppointments);
  const token = useSelector((state) => state.auth.token);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: "", reason: "", startTime: ""
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(""); // reset
    setAvailableSlots([]); // reset
  };

  useEffect(() => {
    dispatch(fetchDoctors({ token }));
  }, [dispatch]);

  const doctorsPerPage = 5;
  const debouncedQuery = useDebounce(searchQuery, 300);
  const filteredDoctors = doctors
    .filter((d) => d.availability && d.availability.length > 0)
    .filter((d) => d.fullName.toLowerCase().includes(debouncedQuery.toLowerCase()));


  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * doctorsPerPage,
    currentPage * doctorsPerPage
  );

  const handleSubmitAppointment = () => {
    const { name, reason, startTime } = appointmentDetails;

    if (!name || !selectedDate || !reason || !startTime || !selectedDoctor) {
      return alert("Please fill all fields, select a date and time.");
    }

    const payload = {
      token,
      doctorId: selectedDoctor._id,
      name: appointmentDetails.name,
      date: selectedDate,
      startTime: appointmentDetails.startTime,
      reason: appointmentDetails.reason,
    };

    dispatch(createAppointment(payload));
    setSelectedDoctor(null);
    setAppointmentDetails({ name: "", date: "", reason: "", email: "", startTime: "" });
    setSelectedDate("");
    setAvailableSlots([]);
  };


  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const availability = selectedDoctor.availability.find(a => a.date === selectedDate);
      if (availability) {
        const { startTime, endTime, slotDuration } = availability;
        const slots = [];

        let [hour, min] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);

        while (hour < endHour || (hour === endHour && min < endMin)) {
          const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
          slots.push(timeStr);

          min += slotDuration;
          if (min >= 60) {
            hour += Math.floor(min / 60);
            min = min % 60;
          }
        }
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    }
  }, [selectedDate, selectedDoctor]);

  return (
    <Container component={Paper} elevation={3} sx={{ p: 3, maxWidth: 600, mt: 5 }}>
      <Typography variant="h5" gutterBottom>Book an Appointment</Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        <strong>Booking Date:</strong> {new Date().toISOString().slice(0, 10)}
      </Typography>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      <ResponsiveField
        label="Search Doctors"
        name="search"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        InputProps={{
          startAdornment: <SearchIcon style={{ marginRight: 8, color: "#9e9e9e" }} />,
        }}
      />

      {loading && <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />}

      <Typography variant="h6" sx={{ mt: 3 }}>Available Doctors</Typography>

      <Grid container spacing={2} mt={1}>
        {paginatedDoctors.map((doc, idx) => (
          <Grid item xs={12} key={idx}>
            <Paper
              elevation={2}
              sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                p: 2, borderRadius: 2, flexWrap: "wrap",
              }}
            >
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography fontWeight={600}>Dr. {doc.fullName}</Typography>
                <Typography variant="body2">{doc.specialization}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {doc.hospitalName} – {doc.hospitalAddress}
                </Typography>
              </Box>
              <Button variant="outlined" color="success" onClick={() => setSelectedDoctor(doc)}>
                Book
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={Boolean(selectedDoctor)} onClose={() => setSelectedDoctor(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight="bold">Book Appointment</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Dr. {selectedDoctor?.fullName}
              </Typography>
            </Box>
            <IconButton onClick={() => setSelectedDoctor(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Grid item xs={12}>
            <ResponsiveField
              label="Your Name"
              name="name"
              type="text"
              required
              value={appointmentDetails.name}
              onChange={(e) =>
                setAppointmentDetails({ ...appointmentDetails, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <ResponsiveField
              label="Reason for Appointment"
              name="reason"
              type="text"
              multiline
              required
              rows={2}
              value={appointmentDetails.reason}
              onChange={(e) =>
                setAppointmentDetails({ ...appointmentDetails, reason: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <ResponsiveField
              label="Select Date"
              name="selectedDate"
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {availableSlots.length > 0 && (
            <Grid item xs={12}>
              <Typography>Select Time Slot</Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                {availableSlots.map(slot => (
                  <Button
                    key={slot}
                    variant={appointmentDetails.startTime === slot ? "contained" : "outlined"}
                    onClick={() => setAppointmentDetails(prev => ({ ...prev, startTime: slot }))}
                  >
                    {slot}
                  </Button>
                ))}
              </Box>
            </Grid>
          )}

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSelectedDoctor(null)} color="secondary">Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmitAppointment} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Confirm Appointment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MakeAppointments;
