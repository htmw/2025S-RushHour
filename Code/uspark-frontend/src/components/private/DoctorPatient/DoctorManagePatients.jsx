/**
 * @file DoctorManagePatients Component
 *
 * @namespace src.components.private.DoctorPatient.DoctorManagePatients
 * @memberof src.components.private.DoctorPatient
 *
 * This component allows doctors to view and manage their patients. It fetches the
 * list of patients associated with the doctor, displays their basic info, and
 * opens a detailed dialog showing medical history, insurance details, and upcoming
 * appointments when "Manage" is clicked. It also provides functionality to segment
 * medical images.
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
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { Science, Delete } from "@mui/icons-material"; // Icon for segmentation
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDoctorPatients,
  fetchDoctorPatientDetails,
  segmentImage,
  deleteSegmentedImage,
} from "../../../store/actions";

const DoctorManagePatients = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { patients, patientDetails, loading, error, segmentedImage } =
    useSelector((state) => state.doctorPatients);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingSegmentation, setLoadingSegmentation] = useState(false);

  useEffect(() => {
    if (token) dispatch(fetchDoctorPatients({ token }));
  }, [token]);

  const handleManage = (patientId) => {
    dispatch(fetchDoctorPatientDetails({ token, patientId }));
    setDialogOpen(true);
  };

  const handleSegmentImage = async (imageUrl, patientId, medicalHistoryId) => {
    setLoadingSegmentation(true);

    try {
      dispatch(segmentImage({ imageUrl, patientId, medicalHistoryId })); // Include medicalHistoryId in the payload
    } catch (error) {
      console.error("Segmentation failed:", error);
    } finally {
      setLoadingSegmentation(false);
    }
  };

  const handleDeleteSegmentedImage = async (segmentedUrl, medicalHistoryId) => {
    try {
      // Dispatch an action or make an API call to delete the image
      console.log(`Deleting segmented image: ${segmentedUrl}`);
      // Example API call (replace with actual implementation)
      dispatch(deleteSegmentedImage({ segmentedUrl, medicalHistoryId }));
    } catch (error) {
      console.error("Failed to delete segmented image:", error);
      alert("Failed to delete the segmented image.");
    }
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
              {/* User Details */}
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  src={patientDetails.user.image}
                  sx={{ width: 60, height: 60 }}
                />
                <Box>
                  <Typography variant="h6">
                    {patientDetails.user.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {patientDetails.user.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* Profile Information */}
              <Box mt={3}>
                <Typography fontWeight="bold" gutterBottom>
                  🧍 Profile Information
                </Typography>
                <Typography>Age: {patientDetails.profile.age}</Typography>
                <Typography>Sex: {patientDetails.profile.sex}</Typography>
                <Typography>
                  Height: {patientDetails.profile.height} cm
                </Typography>
                <Typography>
                  Weight: {patientDetails.profile.weight} kg
                </Typography>
                <Typography>
                  Health Issues:{" "}
                  {patientDetails.profile.healthIssues.length > 0
                    ? patientDetails.profile.healthIssues.join(", ")
                    : "None"}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* Medical History */}
              <Box mt={3}>
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
                        Treatment: {entry.treatmentGiven || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Status: {entry.status}
                      </Typography>
                      {entry.attachments.map((url, i) => {
                        const isImage = /\.(jpeg|jpg|png|gif)$/i.test(url); // Check if the URL is an image
                        return isImage ? (
                          <Box
                            key={i}
                            mt={1}
                            display="flex"
                            alignItems="center"
                          >
                            <img
                              src={url}
                              alt={`Attachment ${i + 1}`}
                              style={{
                                maxWidth: "100%",
                                borderRadius: "8px",
                              }}
                            />
                            <Tooltip title="Segment this image">
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleSegmentImage(
                                    url,
                                    patientDetails.user._id,
                                    entry._id
                                  )
                                } // Pass medicalHistoryId here
                                disabled={loadingSegmentation}
                              >
                                <Science />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Box key={i} mt={1}>
                            <Button
                              variant="outlined"
                              color="primary"
                              component="a"
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Attachment {i + 1}
                            </Button>
                          </Box>
                        );
                      })}

                      {/* Render segmented images if available */}

                      {entry.segmentedAttachments?.map((segmentedUrl, idx) => (
                        <Box
                          key={idx}
                          mt={2}
                          display="flex"
                          alignItems="center"
                          gap={2}
                        >
                          <Box>
                            <Typography variant="caption" fontWeight="bold">
                              Segmented Image {idx + 1}:
                            </Typography>
                            <img
                              src={segmentedUrl}
                              alt={`Segmented ${idx + 1}`}
                              style={{
                                maxWidth: "100%",
                                borderRadius: "8px",
                              }}
                            />
                          </Box>
                          <Tooltip title="Delete this segmented image">
                            <IconButton
                              color="error"
                              onClick={() =>
                                handleDeleteSegmentedImage(
                                  segmentedUrl,
                                  entry._id
                                )
                              }
                            >
                              <Delete />{" "}
                              {/* Replace with a delete icon like Delete or Close */}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ))}

                      {/* Render new segmented image after segmentation */}
                      {segmentedImage && (
                        <Box mt={2}>
                          <Typography variant="caption" fontWeight="bold">
                            New Segmented Image:
                          </Typography>
                          <img
                            src={segmentedImage}
                            alt="New Segmented"
                            style={{
                              maxWidth: "100%",
                              borderRadius: "8px",
                            }}
                          />
                        </Box>
                      )}

                      {/* Show loading spinner during segmentation */}
                      {loadingSegmentation && (
                        <Box mt={2}>
                          <CircularProgress size={24} />
                          <Typography variant="caption" color="text.secondary">
                            Segmenting image...
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No medical history found.
                  </Typography>
                )}
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* Insurance Information */}
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
                      Holder Name: {patientDetails.insurance.holderName}
                    </Typography>
                    <Typography>
                      Valid From:{" "}
                      {new Date(
                        patientDetails.insurance.startDate
                      ).toLocaleDateString()}
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

              {/* Upcoming Appointments */}
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
