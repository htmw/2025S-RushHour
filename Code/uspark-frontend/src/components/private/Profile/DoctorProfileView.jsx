import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Modal,
  Box,
  Alert,
  Paper,
  IconButton,
  TextField,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDoctorProfile,
  uploadVerificationDocs,
} from "../../../store/actions";
import ImageUpload from "../Dashboard/Imageupload";
import ResponsiveField from "../../../utils/components/ResponsiveField.jsx";

const DoctorProfileView = ({ token }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const { userData } = useSelector((state) => state.dashboard);

  // Editable fields
  const [formData, setFormData] = useState({
    fullName: userData.fullName || "",
    specialization: userData.specialization || "",
    experience: userData.experience || "",
    certifications: userData.certifications || "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpload = () => {
    if (!files.length) return alert("Please select documents.");
    const formData = new FormData();
    files.forEach((file) => formData.append("documents", file));
    dispatch(uploadVerificationDocs({ token, formData }));
    setShowModal(false);
  };

  const handleSave = () => {
    console.log("Saving doctor profile:", formData);
    dispatch(updateDoctorProfile(formData));
  };

  console.log("Updating form data1:", userData);
  useEffect(() => {
    console.log("Updating form data:", userData);

    setFormData({
      fullName: userData.fullName || "",
      specialization: userData.specialization || "",
      experience: userData.experience || "",
      certifications: userData.certifications || "",
    });
  }, [userData]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: "10px", width: "99%" }}>
      <ImageUpload userData={userData} />

      <Stack spacing={2} mt={2}>
        <ResponsiveField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          inputProps={{ "data-cy": "doctor-fullName" }}
        />
        <ResponsiveField
          label="Specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          inputProps={{ "data-cy": "doctor-specialization" }}
        />
        <ResponsiveField
          label="Experience (years)"
          name="experience"
          type="number"
          value={formData.experience}
          onChange={handleChange}
          inputProps={{ "data-cy": "doctor-experience" }}
        />
        <ResponsiveField
          label="Certifications"
          name="certifications"
          value={formData.certifications}
          onChange={handleChange}
          inputProps={{ "data-cy": "doctor-certifications" }}
        />
      </Stack>

      {userData.verificationStatus === "approved" && (
        <Typography sx={{ mt: 2 }}>
          <CheckCircleIcon sx={{ color: "green", mr: 1 }} />
          Verified
        </Typography>
      )}

      {userData.verificationStatus === "pending" && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Your verification is pending.
        </Alert>
      )}

      {userData.verificationStatus === "rejected" && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Rejected. Please upload valid documents.
        </Alert>
      )}

      {userData.verificationStatus !== "approved" && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => setShowModal(true)}
          data-cy="doctor-verify-button"
        >
          {userData.verificationStatus === "rejected"
            ? "Re-upload Documents"
            : "Verify"}
        </Button>
      )}

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 2, ml: 2 }}
        onClick={handleSave}
        data-cy="doctor-save"
      >
        Save Changes
      </Button>

      {/* Modal for document upload */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Verification Required</Typography>
            <IconButton onClick={() => setShowModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography sx={{ mt: 1 }}>
            Upload your verification documents.
          </Typography>
          <Paper
            elevation={3}
            sx={paperStyle}
            onClick={() => document.getElementById("fileUpload").click()}
          >
            <input
              type="file"
              id="fileUpload"
              data-cy="doctor-verification-file"
              multiple
              hidden
              onChange={(e) => setFiles([...e.target.files])}
            />
            <Typography>Click to upload</Typography>
          </Paper>
          {files.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2">Selected:</Typography>
              {files.map((f, i) => (
                <Typography key={i}>{f.name}</Typography>
              ))}
            </Box>
          )}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => setShowModal(false)}
              color="error"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              variant="contained"
              data-cy="doctor-verification-upload"
            >
              Upload
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const paperStyle = {
  p: 2,
  mt: 2,
  textAlign: "center",
  border: "2px dashed #ccc",
  borderRadius: 2,
  cursor: "pointer",
};

export default DoctorProfileView;
