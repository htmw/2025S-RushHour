/**
 * @file DoctorManagePatients Component
 *
 * @namespace src.components.private.DoctorPatient.DoctorManagePatients
 * @memberof src.components.private.DoctorPatient
 *
 * This component allows doctors to view and manage their patients. It fetches the
 * list of patients associated with the doctor, displays their basic info, and
 * opens a detailed dialog showing medical history, insurance details, and upcoming
 * appointments when "Manage" is clicked.
 */

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctorPatients,
  fetchDoctorPatientDetails,
} from "../../../store/actions";

/**
 * DoctorManagePatients Component
 *
 * @memberof src.components.private.DoctorPatient.DoctorManagePatients
 *
 * @returns {JSX.Element} - Renders a grid of patient cards and a dialog showing
 * detailed patient information, including medical history, insurance info, and
 * upcoming appointments.
 *
 * @example
 * <DoctorManagePatients />
 */

const DoctorManagePatients = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { patients, patientDetails, loading, error } = useSelector(
    (state) => state.doctorPatients
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (token) dispatch(fetchDoctorPatients({ token }));
  }, [token]);

  const handleManage = (patientId) => {
    dispatch(fetchDoctorPatientDetails({ token, patientId }));
    setDialogOpen(true);
  };

  return (
    <Box mt={4} ml={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        My Patients
      </Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={2}>
        {patients.map((patient) => (
          <Grid item xs={12} md={6} lg={4} key={patient._id}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 3,
                transition: "all 0.3s",
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={patient.image} sx={{ width: 50, height: 50 }}>
                  {patient.fullName[0]}
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>{patient.fullName}</Typography>
                  <Typography fontSize="0.85rem">{patient.email}</Typography>
                  <Typography fontSize="0.85rem" color="text.secondary">
                    Age: {patient.patientProfile?.age || "-"} / Sex:{" "}
                    {patient.patientProfile?.sex || "-"}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2, fontWeight: 600 }}
                onClick={() => handleManage(patient._id)}
              >
                Manage
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Patient Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Patient Details</DialogTitle>
        <DialogContent dividers>
          {patientDetails ? (
            <>
              <Typography variant="h6">
                {patientDetails.user.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {patientDetails.user.email}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box mt={3} sx={{}}>
                <Typography fontWeight="bold" gutterBottom>
                  🧾 Medical History
                </Typography>
                {patientDetails.medicalHistory.length > 0 ? (
                  patientDetails.medicalHistory.map((entry, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 2,
                        mb: 1,
                        background: theme.palette.background.default,
                      }}
                    >
                      <Typography fontWeight={600}>
                        {entry.healthIssue}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {entry.treatmentGiven}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Status: {entry.status}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No medical history found.
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />
              <Box mt={3}>
                <Typography fontWeight="bold" gutterBottom>
                  💳 Insurance Info
                </Typography>
                {patientDetails.insurance ? (
                  <>
                    <Typography>
                      Provider: {patientDetails.insurance.providerName}
                    </Typography>
                    <Typography>
                      Valid Till:{" "}
                      {new Date(
                        patientDetails.insurance.endDate
                      ).toLocaleDateString()}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No insurance information available.
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />
              <Box mt={3}>
                <Typography fontWeight="bold" gutterBottom>
                  📅 Upcoming Appointments
                </Typography>
                {patientDetails.appointments?.length > 0 ? (
                  patientDetails.appointments.map((appt, idx) => (
                    <Typography key={idx} variant="body2">
                      • {appt.date} at {appt.startTime} – {appt.reason}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No upcoming appointments.
                  </Typography>
                )}
              </Box>
            </>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorManagePatients;
