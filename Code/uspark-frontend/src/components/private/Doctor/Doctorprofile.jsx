/**
 * @file Doctor Dashboard component.
 *
 * Displays doctor profile details, verification status, and allows document uploads.
 *
 * @namespace src.components.private.Doctor.DoctorDashboard
 * @memberof src.components.private.Doctor
 */

import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Modal,
  Box,
  Alert,
  Paper,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard, uploadVerificationDocs } from "../../../store/actions";
import DoctorLayout from "../Doctor/DoctorLayout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Doctor Dashboard Component
 *
 * Displays doctor-specific details such as name, specialization, experience,
 * verification status, and provides a document upload feature for verification.
 *
 * @component
 * @memberof src.components.private.Doctor.DoctorDashboard
 * @returns {JSX.Element} The doctor dashboard component.
 */
const DoctorProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** @property {Object} */
  const { userData, loading, error } = useSelector((state) => state.dashboard);

  /** @property {string} */
  const token = useSelector((state) => state.auth?.token);

  /** @property {boolean} */
  const [showModal, setShowModal] = useState(false);

  /** @property {File[]} */
  const [files, setFiles] = useState([]);

  /**
   * Handles file selection for document upload.
   *
   * @function
   * @memberof src.components.private.Doctor.DoctorDashboard
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  /**
   * Handles document upload for verification.
   *
   * @function
   * @memberof src.components.private.Doctor.DoctorDashboard
   */
  const handleUpload = () => {
    if (files.length === 0) {
      alert("Please select at least one document.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("documents", file));

    dispatch(uploadVerificationDocs({ token, formData }));
    setShowModal(false);
  };

  /**
   * Ensures authenticated access and fetches doctor data.
   * Redirects to login if no token is found.
   *
   * @function
   * @memberof src.components.private.Doctor.DoctorDashboard
   * @effect Runs when `token` changes.
   */
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(fetchDashboard({ token }));
    }
  }, [token, dispatch]);

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>Error</div>;
  }

  return (
    <DoctorLayout>
      {/* Doctor Name with Verification Tick */}
      <Typography variant="h5" display="flex" alignItems="center">
        {userData?.fullName}
        {userData?.verificationStatus === "approved" && (
          <CheckCircleIcon sx={{ color: "green", ml: 1 }} />
        )}
      </Typography>

      <Typography>
        <strong>Specialization:</strong> {userData?.specialization}
      </Typography>
      <Typography>
        <strong>Experience:</strong> {userData?.experience} years
      </Typography>
      <Typography>
        <strong>Certifications:</strong> {userData?.certifications || "N/A"}
      </Typography>

      {/* Show Verification Status */}
      {userData?.verificationStatus === "pending" && (
        <Alert severity="warning">Your verification is pending approval.</Alert>
      )}
      {userData?.verificationStatus === "rejected" && (
        <Alert severity="error">
          Your verification was rejected. Please re-upload valid documents.
        </Alert>
      )}

      {/* Show "Verify" or "Re-upload Documents" Button */}
      {userData?.verificationStatus !== "approved" && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => setShowModal(true)}
        >
          {userData?.verificationStatus === "rejected"
            ? "Re-upload Documents"
            : "Verify"}
        </Button>
      )}

      {/* Verification Upload Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Modal Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Verification Required</Typography>
            <IconButton onClick={() => setShowModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography sx={{ mt: 1, color: "gray" }}>
            Please upload supporting documents for verification.
          </Typography>

          {/* File Upload Input */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #ccc",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("fileUpload").click()}
          >
            <input
              type="file"
              multiple
              id="fileUpload"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Typography variant="body1" color="textSecondary">
              Click to upload documents
            </Typography>
          </Paper>

          {/* Show selected files */}
          {files.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Selected Files:</Typography>
              {files.map((file, index) => (
                <Typography key={index} variant="body2" sx={{ color: "white" }}>
                  {file.name}
                </Typography>
              ))}
            </Box>
          )}

          {/* Modal Actions */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              sx={{ mr: 2 }}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleUpload}>
              Upload
            </Button>
          </Box>
        </Box>
      </Modal>
    </DoctorLayout>
  );
};

export default DoctorProfile;
