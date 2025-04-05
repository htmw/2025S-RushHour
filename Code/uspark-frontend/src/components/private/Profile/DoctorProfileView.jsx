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
  Autocomplete,
  Divider,
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
import FileUpload from "../../../utils/components/FileUpload"; // or wherever it's stored
import DoctorAvailabilityCalendar from "./DoctorAvailabilityCalendar"; // adjust path as needed

const DoctorProfileView = ({ token }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const { userData } = useSelector((state) => state.profile);
  const hospitals = useSelector((state) => state.makeAppointments.hospitals || []);

  // Editable fields
  const [formData, setFormData] = useState({
    fullName: userData.fullName || "",
    specialization: userData.specialization || "",
    experience: userData.experience || "",
    certifications: userData.certifications || "",
    hospitalName: userData.hospitalName || "",
    hospitalAddress: userData.hospitalAddress || "",

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
    dispatch(updateDoctorProfile(formData));
  };

  useEffect(() => {

    setFormData({
      fullName: userData.fullName || "",
      specialization: userData.specialization || "",
      experience: userData.experience || "",
      certifications: userData.certifications || "",
      hospitalName: userData.hospitalName || "",
      hospitalAddress: userData.hospitalAddress || "",
    });

  }, [userData]);

  return (
    <Box>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mt: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Doctor Profile
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <ImageUpload userData={userData} fromProfilePage />

        <Stack spacing={3} mt={3}>
          <ResponsiveField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
          <ResponsiveField label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} />
          <ResponsiveField label="Experience (years)" name="experience" type="number" value={formData.experience} onChange={handleChange} />
          <ResponsiveField label="Certifications" name="certifications" value={formData.certifications} onChange={handleChange} />

          <ResponsiveField
            label="Select or Search Hospital"
            customInput={
              <Autocomplete
                fullWidth
                freeSolo
                size="small"
                options={[...hospitals.map((h) => h.name), "Other"]}
                value={formData.hospitalName}
                onChange={(e, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    hospitalName: newValue,
                    hospitalAddress: newValue === "Other" ? "" : hospitals.find((h) => h.name === newValue)?.vicinity || "",
                  }));
                }}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
              />
            }
          />

          {formData.hospitalName === "Other" && (
            <ResponsiveField
              label="Hospital Address"
              name="hospitalAddress"
              value={formData.hospitalAddress}
              onChange={(e) => setFormData({ ...formData, hospitalAddress: e.target.value })}
            />
          )}

          <FileUpload
            title="Uploaded Verification Docs"
            defaultFiles={
              userData.verificationDocs?.map((url) => ({
                fileUrl: url.split("rush-hour-uploads.s3.us-east-2.amazonaws.com/")[1],
                fileName: url.split("/").pop(),
              })) || []
            }
            autoUpload={false}
            signedUrlPath="/api/profile/signed-url"
          />
        </Stack>

        {/* Verification Status */}
        {userData.verificationStatus === "approved" && (
          <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mt: 3 }}>
            Profile Verified
          </Alert>
        )}

        {userData.verificationStatus === "pending" && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            Your verification is pending.
          </Alert>
        )}

        {userData.verificationStatus === "rejected" && (
          <Alert severity="error" sx={{ mt: 3 }}>
            Rejected. Please upload valid documents.
          </Alert>
        )}

        <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
          {userData.verificationStatus !== "approved" && (
            <Button variant="contained" onClick={() => setShowModal(true)} data-cy="doctor-verify-button">
              {userData.verificationStatus === "rejected" ? "Re-upload Documents" : "Verify"}
            </Button>
          )}
          <Button variant="contained" color="success" onClick={handleSave} data-cy="doctor-save">
            Save Changes
          </Button>
        </Stack>
      </Paper>

      {/* Modal for document upload */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Upload Verification Docs</Typography>
            <IconButton onClick={() => setShowModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography sx={{ mt: 2 }}>Click below to upload documents</Typography>

          <Paper
            elevation={3}
            sx={paperStyle}
            onClick={() => document.getElementById("fileUpload").click()}
          >
            <input
              type="file"
              id="fileUpload"
              multiple
              hidden
              onChange={(e) => setFiles([...e.target.files])}
            />
            <Typography>Click to browse or drag & drop</Typography>
          </Paper>

          {files.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2">Selected Files:</Typography>
              {files.map((f, i) => (
                <Typography key={i}>{f.name}</Typography>
              ))}
            </Box>
          )}

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={() => setShowModal(false)} color="error" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleUpload}>
              Upload
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Availability Section */}
      <DoctorAvailabilityCalendar />
    </Box>
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
