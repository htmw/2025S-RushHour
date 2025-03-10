/**
 * @file Doctor Dashboard component.
 *
 * Displays doctor profile details, verification status, and allows document uploads.
 *
 * @namespace src.components.private.Doctor.DoctorDashboard
 * @memberof src.components.private.Doctor
 */

import React, { useEffect, useState } from "react";
import { Typography, Button, Modal, Box, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard, uploadVerificationDocs } from "../../../store/actions";
import DoctorLayout from "../Doctor/DoctorLayout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
const DoctorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** @property {Object} */
  const { doctorData, loading, error } = useSelector(
    (state) => state.dashboard
  );

  /** @property {string} */
  const token = useSelector((state) => state.auth?.token);

  /** @property {boolean} */
  const [showModal, setShowModal] = useState(false);

  /** @property {File[]} */
  const [files, setFiles] = useState([]);
  ``;

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
        {doctorData?.fullName}
        {doctorData?.verificationStatus === "approved" && (
          <CheckCircleIcon sx={{ color: "green", ml: 1 }} />
        )}
      </Typography>

      <Typography>
        <strong>Specialization:</strong> {doctorData?.specialization}
      </Typography>
      <Typography>
        <strong>Experience:</strong> {doctorData?.experience} years
      </Typography>
      <Typography>
        <strong>Certifications:</strong> {doctorData?.certifications || "N/A"}
      </Typography>

      {/* Show Verification Status */}
      {doctorData?.verificationStatus === "pending" && (
        <Alert severity="warning">Your verification is pending approval.</Alert>
      )}
      {doctorData?.verificationStatus === "rejected" && (
        <Alert severity="error">
          Your verification was rejected. Please re-upload valid documents.
        </Alert>
      )}

      {/* Show "Verify" or "Re-upload Documents" Button */}
      {doctorData?.verificationStatus !== "approved" && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => setShowModal(true)}
        >
          {doctorData?.verificationStatus === "rejected"
            ? "Re-upload Documents"
            : "Verify"}
        </Button>
      )}

      {/* Verification Upload Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box>
          <Typography variant="h6">Verification Required</Typography>
          <Typography>
            Please upload supporting documents for verification.
          </Typography>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ marginTop: 10 }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="error"
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

export default DoctorDashboard;
