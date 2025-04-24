/**
 * @file DoctorAvailabilityCalendar Component
 *
 * @namespace src.components.private.profile.DoctorAvailabilityCalendar
 * @memberof src.components.private.profile
 *
 * This component allows doctors to manage their availability by defining
 * time slots over a selected date range. It supports slot generation,
 * weekend inclusion, slot duration configuration, and slot editing.
 * Booked slots are visually indicated, and appointment info is shown for edits.
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  Pagination,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import ResponsiveField from "../../../utils/components/ResponsiveField";
import {
  fetchDoctorAvailability,
  saveDoctorAvailability,
  updateDoctorAvailability,
} from "../../../store/actions";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import EditIcon from "@mui/icons-material/Edit";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * DoctorAvailabilityCalendar Component
 *
 * @memberof src.components.private.profile.DoctorAvailabilityCalendar
 *
 * @returns {JSX.Element} - A full-featured calendar interface for doctors
 * to create, view, filter, and edit their availability time slots,
 * with pagination and support for showing booked appointments.
 *
 * @example
 * <DoctorAvailabilityCalendar />
 */

const DoctorAvailabilityCalendar = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { availability } = useSelector((state) => state.doctorAvailability);
  const { data: appointments } = useSelector((state) => state.appointments);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [slotDuration, setSlotDuration] = useState(30);
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [filterStart, setFilterStart] = useState(null);
  const [filterEnd, setFilterEnd] = useState(null);
  const [editedMode, setEditedMode] = useState("both");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editedStartTime, setEditedStartTime] = useState(null);
  const [editedEndTime, setEditedEndTime] = useState(null);
  const [mode, setMode] = useState("both"); // default to 'both'
  const [showWarning, setShowWarning] = useState(false);
  const [affectedAppointments, setAffectedAppointments] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 6;

  const filteredAvailability = availability.filter((slot) => {
    const slotDate = dayjs(slot.date, "YYYY-MM-DD");

    const isAfterStart = filterStart
      ? slotDate.isSameOrAfter(dayjs(filterStart), "day")
      : true;
    const isBeforeEnd = filterEnd
      ? slotDate.isSameOrBefore(dayjs(filterEnd), "day")
      : true;

    return isAfterStart && isBeforeEnd;
  });

  const totalPages = Math.ceil(filteredAvailability.length / slotsPerPage);
  const paginatedSlots = filteredAvailability.slice(
    (currentPage - 1) * slotsPerPage,
    currentPage * slotsPerPage
  );
  const sortedDates = availability
    .map((slot) => dayjs(slot.date, "YYYY-MM-DD"))
    .sort((a, b) => a.valueOf() - b.valueOf());

  const earliestAvailableDate = sortedDates.length ? sortedDates[0] : dayjs();
  const latestAvailableDate = sortedDates.length
    ? sortedDates[sortedDates.length - 1]
    : dayjs();

  const sortedStartTimes = availability
    .map((slot) => dayjs(`2025-01-01T${slot.startTime}`))
    .sort((a, b) => a.valueOf() - b.valueOf());

  const sortedEndTimes = availability
    .map((slot) => dayjs(`2025-01-01T${slot.endTime}`))
    .sort((a, b) => a.valueOf() - b.valueOf());

  const earliestStartTime = sortedStartTimes.length
    ? sortedStartTimes[0]
    : null;
  const latestEndTime = sortedEndTimes.length
    ? sortedEndTimes[sortedEndTimes.length - 1]
    : null;

  const latestSlot = availability.length
    ? availability
        .slice()
        .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())[0]
    : null;

  const isSlotBooked = (slot) => {
    return appointments?.some(
      (appt) =>
        appt.date === slot.date &&
        dayjs(appt.startTime, "HH:mm").isSameOrAfter(
          dayjs(slot.startTime, "HH:mm")
        ) &&
        dayjs(appt.startTime, "HH:mm").isBefore(dayjs(slot.endTime, "HH:mm"))
    );
  };
  const bookedAppointment = appointments.find(
    (appt) =>
      appt.date === editingSlot?.date &&
      appt.startTime >= editingSlot?.startTime &&
      appt.startTime < editingSlot?.endTime
  );
  useEffect(() => {
    if (token) {
      dispatch(fetchDoctorAvailability(token));
    }
  }, [dispatch, token]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStart, filterEnd]);

  const getDatesBetween = (start, end) => {
    const dateList = [];
    let current = start.clone();
    while (current.isBefore(end) || current.isSame(end, "day")) {
      if (
        includeWeekends ||
        (!includeWeekends && current.day() !== 0 && current.day() !== 6)
      ) {
        dateList.push(current.clone());
      }
      current = current.add(1, "day");
    }
    return dateList;
  };

  const handleRemoveSlot = (index) => {
    const updated = [...generatedSlots];
    updated.splice(index, 1);
    setGeneratedSlots(updated);
  };

  const handleGenerateSlots = () => {
    if (!startDate || !endDate || !startTime || !endTime) return;

    const days = getDatesBetween(startDate, endDate);
    const slots = days.map((d) => ({
      date: d.format("YYYY-MM-DD"),
      startTime,
      endTime,
      mode,
    }));
    setGeneratedSlots(slots);
  };

  const handleSlotChange = (index, type, value) => {
    const updated = [...generatedSlots];
    updated[index][type] = value;
    setGeneratedSlots(updated);
  };

  const handleApprove = () => {
    const final = generatedSlots.map((slot) => ({
      date: slot.date,
      startTime: slot.startTime.format("HH:mm"),
      endTime: slot.endTime.format("HH:mm"),
      slotDuration,
      mode: slot.mode || mode, // fallback if undefined
    }));

    if (token) {
      dispatch(saveDoctorAvailability({ token, slots: final }));
    }

    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setStartDate(earliestAvailableDate);
    setEndDate(latestAvailableDate);
    setStartTime(earliestStartTime);
    setEndTime(latestEndTime);
    setMode(latestSlot?.mode || "both");
    setSlotDuration(latestSlot?.slotDuration || 30);
    setIncludeWeekends(false);
    setGeneratedSlots([]);
  };

  const handleEditSave = () => {
    if (!editingSlot) return;

    // Find affected appointments
    const affected = appointments.filter(
      (appt) =>
        appt.date === editingSlot.date &&
        dayjs(appt.startTime, "HH:mm").isSameOrAfter(editedStartTime) &&
        dayjs(appt.startTime, "HH:mm").isBefore(editedEndTime)
    );

    if (affected.length > 0) {
      setAffectedAppointments(affected);
      setShowWarning(true);
      return;
    }

    proceedWithEdit();
  };

  const proceedWithEdit = () => {
    const updatedSlot = {
      _id: editingSlot._id,
      date: editingSlot.date,
      startTime: editedStartTime.format("HH:mm"),
      endTime: editedEndTime.format("HH:mm"),
      slotDuration: editingSlot.slotDuration,
      mode: editedMode,
    };

    dispatch(updateDoctorAvailability({ token, slot: updatedSlot }));
    setEditDialogOpen(false);
    setEditingSlot(null);
    setShowWarning(false);
    setAffectedAppointments([]);
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Doctor Availability
        </Typography>
        <Typography variant="body2" mb={2}>
          Define your availability slots for the next 3 months.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setStartDate(earliestAvailableDate);
            setEndDate(latestAvailableDate);
            setStartTime(earliestStartTime);
            setEndTime(latestEndTime);
            setMode(latestSlot?.mode || "both");
            setSlotDuration(latestSlot?.slotDuration || 30);
            setDialogOpen(true);
          }}
        >
          Add Availability
        </Button>
        <Box mt={2} mb={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={filterStart}
                  onChange={setFilterStart}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={filterEnd}
                  onChange={setFilterEnd}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                onClick={() => {
                  setFilterStart(null);
                  setFilterEnd(null);
                }}
                color="secondary"
                variant="outlined"
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          {availability.length === 0 ? (
            <Typography>No availability added yet.</Typography>
          ) : (
            <Stack spacing={2}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 2 }}
              >
                Showing <strong>{filteredAvailability.length}</strong> slots
              </Typography>
              {filteredAvailability.length === 0 ? (
                <Typography>
                  No availability found for selected dates.
                </Typography>
              ) : (
                <Grid container spacing={2} mt={1}>
                  {paginatedSlots.map((slot, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          position: "relative",
                          borderLeft: "5px solid #1976d2",
                          borderRadius: 3,
                          boxShadow: 2,
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.01)",
                            boxShadow: 6,
                          },
                          backgroundColor: isSlotBooked(slot)
                            ? "#fff8dc"
                            : "#f9f9fb",
                          borderLeft: isSlotBooked(slot)
                            ? "5px solid #ffc107"
                            : "5px solid #1976d2",
                        }}
                      >
                        <IconButton
                          aria-label="edit"
                          onClick={() => {
                            setEditingSlot(slot);
                            setEditedStartTime(
                              dayjs(`2025-01-01T${slot.startTime}`)
                            );
                            setEditedEndTime(
                              dayjs(`2025-01-01T${slot.endTime}`)
                            );
                            setEditDialogOpen(true);
                            setEditedMode(slot.mode || "both");
                          }}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "#f0f0f0",
                            "&:hover": {
                              backgroundColor: "#e0e0e0",
                            },
                            boxShadow: 1,
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <CardContent sx={{ pb: "12px !important" }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ fontSize: "0.85rem", mb: 1 }}
                          >
                            {dayjs(slot.date).format("dddd, MMM D")}
                          </Typography>

                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          >
                            <AccessTimeIcon
                              fontSize="small"
                              sx={{ mr: 1, verticalAlign: "middle" }}
                            />
                            {slot.startTime} - {slot.endTime}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ mt: 1, fontSize: "0.85rem", color: "#555" }}
                          >
                            <TimelapseIcon
                              fontSize="small"
                              sx={{ mr: 0.5, verticalAlign: "middle" }}
                            />
                            Slot Duration:{" "}
                            <strong>{slot.slotDuration} minutes</strong>
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ mt: 0.5, fontSize: "0.85rem", color: "#666" }}
                          >
                            Consultation Mode:{" "}
                            <strong>
                              {slot.mode === "both"
                                ? "Let Patient Choose"
                                : slot.mode === "virtual"
                                ? "Virtual Only"
                                : "In-Person Only"}
                            </strong>
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              {totalPages > 1 && (
                <Box mt={3} display="flex" justifyContent="center">
                  <Stack spacing={2}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(e, value) => setCurrentPage(value)}
                      color="primary"
                      size="medium"
                      showFirstButton
                      showLastButton
                    />
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Box>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Set Availability
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: "75vh", overflowY: "auto" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  minDate={startDate || earliestAvailableDate}
                  maxDate={dayjs().add(3, "month")}
                  slotProps={{ textField: { fullWidth: true, size: "small" } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  minDate={startDate || earliestAvailableDate}
                  maxDate={dayjs().add(3, "month")}
                  slotProps={{ textField: { fullWidth: true, size: "small" } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={setStartTime}
                  slotProps={{ textField: { fullWidth: true, size: "small" } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="End Time"
                  value={endTime}
                  onChange={setEndTime}
                  slotProps={{ textField: { fullWidth: true, size: "small" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <ResponsiveField
                  label="Slot Duration (minutes)"
                  name="slotDuration"
                  type="number"
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <ResponsiveField
                  label="Consultation Mode"
                  name="mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  select
                  required
                  options={[
                    { value: "in-person", label: "In-Person" },
                    { value: "virtual", label: "Virtual" },
                    { value: "both", label: "Let Patient Choose" },
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeWeekends}
                      onChange={(e) => setIncludeWeekends(e.target.checked)}
                    />
                  }
                  label="Include Weekends"
                />
              </Grid>
            </Grid>

            <Stack spacing={2} mt={2}>
              {generatedSlots.map((slot, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{ position: "relative" }}
                >
                  <CardHeader
                    title={`Date: ${slot.date}`}
                    action={
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleRemoveSlot(index)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    sx={{ pb: 0 }}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TimePicker
                          label="Start Time"
                          value={slot.startTime}
                          onChange={(val) =>
                            handleSlotChange(index, "startTime", val)
                          }
                          slotProps={{
                            textField: { fullWidth: true, size: "small" },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TimePicker
                          label="End Time"
                          value={slot.endTime}
                          onChange={(val) =>
                            handleSlotChange(index, "endTime", val)
                          }
                          slotProps={{
                            textField: { fullWidth: true, size: "small" },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="error">
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleGenerateSlots}>
            Generate
          </Button>
          <Button
            variant="contained"
            onClick={handleApprove}
            disabled={generatedSlots.length === 0}
          >
            Approve & Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Slot</DialogTitle>
        <DialogContent dividers>
          {bookedAppointment && (
            <Paper
              elevation={1}
              sx={{ p: 2, mb: 2, backgroundColor: "#fff8dc" }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Appointment Info
              </Typography>
              <Typography variant="body2">
                <strong>Patient:</strong> {bookedAppointment.name}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {bookedAppointment.email}
              </Typography>
              <Typography variant="body2">
                <strong>Reason:</strong> {bookedAppointment.reason}
              </Typography>
              <Typography variant="body2">
                <strong>Time:</strong> {bookedAppointment.startTime}
              </Typography>
            </Paper>
          )}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TimePicker
                  label="Start Time"
                  value={editedStartTime}
                  onChange={setEditedStartTime}
                  slotProps={{ textField: { fullWidth: true, size: "small" } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="End Time"
                  value={editedEndTime}
                  onChange={setEditedEndTime}
                  slotProps={{ textField: { fullWidth: true, size: "small" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <ResponsiveField
                  label="Slot Duration (minutes)"
                  name="slotDuration"
                  type="number"
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <ResponsiveField
                  label="Consultation Mode"
                  name="mode"
                  required
                  value={editedMode}
                  onChange={(e) => setEditedMode(e.target.value)}
                  select
                  options={[
                    { value: "in-person", label: "In-Person" },
                    { value: "virtual", label: "Virtual" },
                    { value: "both", label: "Let Patient Choose" },
                  ]}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="error">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showWarning} onClose={() => setShowWarning(false)}>
        <DialogTitle color="error">⚠️ Warning</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Modifying this slot will affect existing appointments. Please
            review:
          </Typography>
          <ul>
            {affectedAppointments.map((appt, i) => (
              <li key={i}>
                <Typography variant="body2">
                  📅 {appt.date} - ⏰ {appt.startTime} - 👤 {appt.name} (
                  {appt.email})
                </Typography>
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWarning(false)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={proceedWithEdit}>
            Proceed Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DoctorAvailabilityCalendar;
