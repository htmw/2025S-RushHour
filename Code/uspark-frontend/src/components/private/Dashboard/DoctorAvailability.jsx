/**
 * @file DoctorAvailabilityCalendar Component
 *
 * @namespace src.components.private.Dashboard.DoctorAvailabilityCalendar
 * @memberof src.components.private.Dashboard
 *
 * This component displays a doctor's availability calendar using MUI's DateCalendar.
 * It shows available days, highlights booked slots, and allows viewing appointment
 * details. Integrates with appointment and availability data from Redux.
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

/**
 * DoctorAvailabilityCalendar Component
 *
 * @memberof src.components.private.Dashboard.DoctorAvailabilityCalendar
 *
 * @param {Object} props
 * @param {Array} props.availability - Array of available time slot objects for the doctor.
 * @param {Array} props.appointments - Array of booked appointments.
 *
 * @returns {JSX.Element} - A calendar with marked available and booked days and time slots,
 * with tooltip previews and dialog-based appointment details.
 *
 * @example
 * <DoctorAvailabilityCalendar availability={availability} appointments={appointments} />
 */

const generateTimeSlots = (startTime, endTime, slotDuration) => {
  const slots = [];
  let start = dayjs(`2025-01-01T${startTime}`);
  const end = dayjs(`2025-01-01T${endTime}`);

  while (start.isBefore(end)) {
    slots.push(start.format("HH:mm"));
    start = start.add(slotDuration, "minute");
  }
  return slots;
};

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.getContrastText(theme.palette.grey[900]),
    fontSize: "0.75rem",
    borderRadius: "6px",
    padding: "6px 10px",
  },
}));

const DoctorAvailabilityCalendar = ({ availability, appointments }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const availableDates = availability.map((a) => a.date);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);
  const bookedMap = {};
  const bookedSlotsMap = {};
  appointments.forEach((appt) => {
    if (!bookedSlotsMap[appt.date]) {
      bookedSlotsMap[appt.date] = new Set();
    }
    bookedSlotsMap[appt.date].add(appt.startTime);
  });
  appointments.forEach((appt) => {
    const date = appt.date;
    if (!bookedMap[date]) bookedMap[date] = new Set();
    bookedMap[date].add(appt.startTime);
  });
  const handleDateChange = (newDate) => {
    const formatted = newDate.format("YYYY-MM-DD");
    if (availableDates.includes(formatted)) {
      setSelectedDate(newDate);
    } else {
      setSelectedDate(null);
    }
  };

  const selectedDayAvailability = availability.find(
    (a) => a.date === selectedDate?.format("YYYY-MM-DD")
  );

  const timeSlots = selectedDayAvailability
    ? generateTimeSlots(
        selectedDayAvailability.startTime,
        selectedDayAvailability.endTime,
        selectedDayAvailability.slotDuration
      )
    : [];

  const bookedSlots = timeSlots.filter((slot) =>
    bookedSlotsMap[selectedDate?.format("YYYY-MM-DD")]?.has(slot)
  );
  const availableSlots = timeSlots.filter(
    (slot) => !bookedSlotsMap[selectedDate?.format("YYYY-MM-DD")]?.has(slot)
  );
  const sortedSlots = [...bookedSlots, ...availableSlots];

  const getTooltipText = (date) => {
    const match = availability.find((a) => a.date === date);
    return match
      ? `Available: ${match.startTime} - ${match.endTime} (${match.slotDuration} mins)`
      : "";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box mt={2}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Select an Available Date
        </Typography>

        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            padding: 2,
          }}
        >
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            shouldDisableDate={(date) => {
              const formatted = date.format("YYYY-MM-DD");
              return !availableDates.includes(formatted);
              const isBooked = bookedMap[formatted]?.size > 0;
            }}
            slots={{
              day: (props) => {
                const formatted = props.day.format("YYYY-MM-DD");
                const isAvailable = availableDates.includes(formatted);
                return (
                  <StyledTooltip
                    title={getTooltipText(formatted)}
                    arrow
                    placement="top"
                  >
                    <Box
                      onClick={() => {
                        if (isAvailable) {
                          handleDateChange(props.day);
                        }
                      }}
                      sx={{
                        backgroundColor: isAvailable
                          ? bookedSlotsMap[formatted]?.size
                            ? theme.palette.warning.light
                            : theme.palette.success.light
                          : "transparent",
                        border: isAvailable
                          ? bookedSlotsMap[formatted]?.size
                            ? `2px solid ${theme.palette.warning.main}`
                            : `2px solid ${theme.palette.success.main}`
                          : "none",
                        borderRadius: "50%",
                        cursor: isAvailable ? "pointer" : "not-allowed",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "&:hover": {
                          backgroundColor: isAvailable ? "#c2e5c7" : "#f5f5f5",
                        },
                      }}
                    >
                      {props.day.date()}
                    </Box>
                  </StyledTooltip>
                );
              },
            }}
          />
          <Box mt={2}>
            <Typography variant="subtitle2">
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  backgroundColor: theme.palette.success.light,
                  border: `2px solid ${theme.palette.success.main}`,
                  borderRadius: 4,
                  marginRight: 8,
                }}
              />
              Available Day
            </Typography>
            <Typography variant="subtitle2">
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  backgroundColor: theme.palette.warning.light,
                  border: `2px solid ${theme.palette.warning.main}`,
                  borderRadius: 4,
                  marginRight: 8,
                }}
              />
              Appointments
            </Typography>
          </Box>
        </Box>

        {/* Time slots section */}
        <Box mt={3}>
          {timeSlots.length > 0 ? (
            <>
              <Typography variant="subtitle1" mb={2}>
                Time slots on{" "}
                <strong>{selectedDate?.format("MMM D, YYYY")}</strong>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  gap: 2,
                  pb: 1,
                  px: 1,
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": {
                    height: 6,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ccc",
                    borderRadius: 4,
                  },
                }}
              >
                {sortedSlots.map((slot, idx) => {
                  const isBooked = bookedSlotsMap[selectedDate]?.has(slot);

                  return (
                    <Paper
                      key={idx}
                      elevation={2}
                      sx={{
                        minWidth: isMobile ? 80 : 100,
                        flex: "0 0 auto",
                      }}
                    >
                      <Button
                        fullWidth
                        sx={{
                          backgroundColor: bookedMap[
                            selectedDate?.format("YYYY-MM-DD")
                          ]?.has(slot)
                            ? "#fff3cd" // Yellow for booked
                            : "#ffffff",
                          borderColor: bookedMap[
                            selectedDate?.format("YYYY-MM-DD")
                          ]?.has(slot)
                            ? "#ffc107"
                            : "default",
                          "&:hover": {
                            backgroundColor: bookedMap[
                              selectedDate?.format("YYYY-MM-DD")
                            ]?.has(slot)
                              ? "#ffe8a1"
                              : "#f0f0f0",
                          },
                        }}
                        variant={isBooked ? "contained" : "outlined"}
                        color={isBooked ? "warning" : "primary"}
                        disabled={isBooked}
                        onClick={() => {
                          const appointment = appointments.find(
                            (a) =>
                              a.date === selectedDate.format("YYYY-MM-DD") &&
                              a.startTime === slot
                          );
                          if (appointment) {
                            setSelectedSlotInfo(appointment);
                            setOpenDialog(true);
                          }
                        }}
                      >
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          <span>{slot}</span>
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.65rem", color: "#555" }}
                          >
                            {selectedDayAvailability.mode === "both"
                              ? "👥 Patient Choice"
                              : selectedDayAvailability.mode === "virtual"
                              ? "🖥️ Virtual"
                              : "🏥 In-Person"}
                          </Typography>
                        </Box>
                      </Button>
                    </Paper>
                  );
                })}
              </Box>
            </>
          ) : (
            <Typography variant="body2" mt={2}>
              Select a date to view available time slots.
            </Typography>
          )}
        </Box>

        <Divider sx={{ mt: 4 }} />
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 2,
              backgroundColor: theme.palette.background.default,
              boxShadow: theme.shadows[6],
            },
          }}
        >
          <DialogTitle
            sx={{ fontWeight: 600, fontSize: "1.3rem", color: "#333" }}
          >
            📝 Appointment Details
          </DialogTitle>

          <DialogContent sx={{ mt: 1 }}>
            {selectedSlotInfo ? (
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Typography>
                  <strong>👤 Patient:</strong> {selectedSlotInfo.name}
                </Typography>
                <Typography>
                  <strong>📧 Email:</strong> {selectedSlotInfo.email}
                </Typography>
                <Typography>
                  <strong>📅 Date:</strong> {selectedSlotInfo.date}
                </Typography>
                <Typography>
                  <strong>⏰ Time:</strong> {selectedSlotInfo.startTime}
                </Typography>
                <Typography>
                  <strong>📄 Reason:</strong> {selectedSlotInfo.reason}
                </Typography>
              </Box>
            ) : (
              <Typography>No details found.</Typography>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default DoctorAvailabilityCalendar;
