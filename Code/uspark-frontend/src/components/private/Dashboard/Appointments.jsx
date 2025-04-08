/**
 * @file AppointmentsPage Component
 *
 * @namespace src.components.private.Dashboard.AppointmentsPage
 * @memberof src.components.private.Dashboard
 *
 * This component displays a list of user appointments with options to edit or cancel.
 * It integrates with Redux to fetch, update, and delete appointments. Dialog is used for editing.
 */

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ResponsiveField from "../../../utils/components/ResponsiveField";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAppointment,
  fetchAppointments,
  updateAppointment,
} from "../../../store/actions";


/**
 * AppointmentsPage Component
 *
 * @memberof src.components.private.Dashboard.AppointmentsPage
 *
 * @returns {JSX.Element} - A list of upcoming appointments with edit and cancel functionality.
 *
 * @example
 * <AppointmentsPage />
 */

const AppointmentsPage = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { data: appointments, loading, error } = useSelector(
    (state) => state.appointments
  );

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editFields, setEditFields] = useState({
    date: "",
    startTime: "",
    reason: "",
  });

  useEffect(() => {
    if (token) dispatch(fetchAppointments({ token }));
  }, [dispatch, token]);

  const handleOpenEditDialog = (appt) => {
    setEditingAppointment(appt);
    setEditFields({
      date: appt.date,
      startTime: appt.startTime,
      reason: appt.reason,
    });
  };

  const handleCloseDialog = () => {
    setEditingAppointment(null);
    setEditFields({ date: "", startTime: "", reason: "" });
  };

  const handleUpdateAppointment = () => {
    const { date, startTime, reason } = editFields;
    dispatch(
      updateAppointment({
        token,
        id: editingAppointment._id,
        date,
        startTime,
        reason,
      })
    );
    handleCloseDialog();
  };

  const handleCancelAppointment = () => {
    dispatch(deleteAppointment({ token, id: editingAppointment._id }));
    handleCloseDialog();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        📋 Your Appointments
      </Typography>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography>Loading...</Typography>
      ) : appointments.length > 0 ? (
        <Grid container spacing={2}>
          {appointments.map((appt) => (
            <Grid item xs={12} md={6} key={appt._id}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight={600}>{appt.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      📅 {appt.date} at ⏰ {appt.startTime}
                    </Typography>
                    {appt.doctor?.hospitalName && (
                      <>
                        <Typography variant="body2">
                          🏥 {appt.doctor.hospitalName}
                        </Typography>
                        <Typography variant="body2">
                          📍 {appt.doctor.hospitalAddress}
                        </Typography>
                      </>
                    )}
                    <Typography variant="body2">📝 {appt.reason}</Typography>
                  </Box>
                  <IconButton onClick={() => handleOpenEditDialog(appt)}>
                    <EditIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No appointments found.</Typography>
      )}

      {/* Edit Dialog */}
      <Dialog open={Boolean(editingAppointment)} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Edit Appointment
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <ResponsiveField
              label="Date"
              name="date"
              type="date"
              value={editFields.date}
              onChange={(e) =>
                setEditFields((prev) => ({ ...prev, date: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              required
            />
            <ResponsiveField
              label="Start Time"
              name="startTime"
              type="time"
              value={editFields.startTime}
              onChange={(e) =>
                setEditFields((prev) => ({ ...prev, startTime: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              required
            />
            <ResponsiveField
              label="Reason"
              name="reason"
              multiline
              rows={2}
              value={editFields.reason}
              onChange={(e) =>
                setEditFields((prev) => ({ ...prev, reason: e.target.value }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button onClick={handleCancelAppointment} color="error">
            Cancel Appointment
          </Button>
          <Box>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button onClick={handleUpdateAppointment} variant="contained" sx={{ ml: 1 }}>
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentsPage;
