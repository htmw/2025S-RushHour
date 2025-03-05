import React, { useEffect, useState } from "react";
import { Typography, Button, Modal, Box, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard, uploadVerificationDocs } from "../../../store/actions";
import DoctorLayout from "../Doctor/DoctorLayout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctorData, loading, error } = useSelector(
    (state) => state.dashboard
  );
  console.log({ doctorData, loading, error });
  const token = useSelector((state) => state.auth?.token);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(fetchDashboard({ token }));
    }
  }, [token, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }
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
