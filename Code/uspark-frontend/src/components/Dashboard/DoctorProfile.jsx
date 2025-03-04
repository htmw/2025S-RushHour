import React, { useEffect, useState } from "react";
import { Typography, Button, Modal, Box, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboard } from "../../store/actions";
import axios from "axios";
import DoctorLayout from "../../pages/DoctorLayout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; 

const DoctorProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.dashboard);
  const token = useSelector((state) => state.auth?.token);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(fetchDashboard({ token }));
    }
  }, [token, dispatch]);

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one document.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("documents", file));

    try {
      await axios.post("http://localhost:5000/api/dashboard/doctor/verify", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Verification request submitted successfully.");
      setShowModal(false);
      dispatch(fetchDashboard({ token })); // for refreshing the profile after submission
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload documents. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DoctorLayout>
      {/* code for doctor name with tick mark */}
      <Typography variant="h5" display="flex" alignItems="center">
        {userData.fullName} 
        {userData.verificationStatus === "approved" && (
          <CheckCircleIcon sx={{ color: "green", ml: 1 }} /> 
        )}
      </Typography>

      <Typography><strong>Specialization:</strong> {userData.specialization}</Typography>
      <Typography><strong>Experience:</strong> {userData.experience} years</Typography>
      <Typography><strong>Certifications:</strong> {userData.certifications || "N/A"}</Typography>

      {/* Show Verification Status */}
      {userData.verificationStatus === "pending" && (
        <Alert severity="warning">Your verification is pending approval.</Alert>
      )}
      {userData.verificationStatus === "rejected" && (
        <Alert severity="error">
          Your verification was rejected. Please re-upload valid documents.
        </Alert>
      )}

      {/*  Show "Verify" or "Re-upload Documents" Button Until Verified */}
      {userData.verificationStatus !== "approved" && (
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => setShowModal(true)}
        >
          {userData.verificationStatus === "rejected" ? "Re-upload Documents" : "Verify"}
        </Button>
      )}

      {/* Verification Upload Popup with Cancel Button */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">Verification Required</Typography>
          <Typography>Please upload supporting documents for verification.</Typography>
          <input type="file" multiple onChange={handleFileChange} style={{ marginTop: 10 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" color="error" onClick={() => setShowModal(false)}>
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
