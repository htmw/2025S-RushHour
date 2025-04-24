/**
 * @file DoctorOnBoarding Component
 *
 * @namespace src.components.private.onBoarding.DoctorOnBoarding
 * @memberof src.components.private.onBoarding
 *
 * This component renders the onboarding form for doctors, allowing them to submit
 * personal and professional details, select or input hospital information, and upload
 * verification documents. It integrates geolocation for hospital suggestions and handles
 * document upload and profile submission via Redux actions.
 */

import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ResponsiveField from "../../../utils/components/ResponsiveField.jsx";
import FileUpload from "../../../utils/components/FileUpload.jsx";
import {
  doctorOnboarding,
  fetchHospitals,
  uploadVerificationDocs,
} from "../../../store/actions";
import history from "../../../history";

/**
 * DoctorOnBoarding Component
 *
 * @memberof src.components.private.onBoarding.DoctorOnBoarding
 *
 * @returns {JSX.Element} - A form interface for doctors to complete onboarding,
 * including fields for specialization, experience, certifications, hospital selection,
 * and document uploads. Automatically fetches nearby hospitals using location.
 *
 * @example
 * <DoctorOnBoarding />
 */

const DoctorOnBoarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const hospitals = useSelector(
    (state) => state.makeAppointments.hospitals || []
  );

  const { doctorData, loading, error } = useSelector(
    (state) => state.onBoarding
  );

  const [selectedHospital, setSelectedHospital] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [documents, setDocuments] = useState([]);

  const [formData, setFormData] = useState({
    name: user.fullName || "",
    specialization: "",
    experience: "",
    certifications: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }, navigate);
  };

  const handleSubmit = async () => {
    const hospitalInfo =
      selectedHospital === "Other"
        ? { hospitalName: "Other", hospitalAddress }
        : {
            hospitalName: selectedHospital,
            hospitalAddress:
              hospitals.find((h) => h.name === selectedHospital)?.vicinity ||
              "",
          };

    const finalData = { ...formData, ...hospitalInfo };

    await dispatch(
      doctorOnboarding({ formData: finalData, token: user.token }, navigate)
    );

    if (documents.length > 0) {
      const form = new FormData();
      documents.forEach((file) => {
        form.append("documents", file.fileObject || file); // handle both raw and wrapped
      });

      await dispatch(
        uploadVerificationDocs({ formData: form, token: user.token })
      );
    }
  };

  const handleHospitalChange = (e) => {
    const value = e.target.value;
    setSelectedHospital(value);
    if (value !== "Other") setHospitalAddress("");
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        dispatch(fetchHospitals({ lat: latitude, long: longitude }));
      },
      () => alert("Enable location to fetch hospitals."),
      { enableHighAccuracy: true }
    );
  }, [dispatch]);

  useEffect(() => {
    if (doctorData) {
      history.push("/dashboard");
    }
  }, [doctorData, navigate]);

  return (
    <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Doctor Onboarding
      </Typography>

      <Box component="form">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ResponsiveField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ResponsiveField
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ResponsiveField
              label="Years of Experience"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ResponsiveField
              label="Certifications"
              name="certifications"
              multiline
              rows={2}
              value={formData.certifications}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Hospital Autocomplete Field */}
            <ResponsiveField
              label="Select or Search Hospital"
              customInput={
                <Autocomplete
                  fullWidth
                  freeSolo
                  size="small"
                  options={[...hospitals.map((h) => h.name), "Other"]}
                  value={selectedHospital}
                  onChange={(e, newValue) => {
                    setSelectedHospital(newValue);
                    if (newValue !== "Other") setHospitalAddress("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      inputProps={{
                        ...params.inputProps,
                        "data-cy": "select-hospital",
                      }}
                    />
                  )}
                />
              }
            />
          </Grid>

          {selectedHospital === "Other" && (
            <Grid item xs={12}>
              <ResponsiveField
                label="Hospital/Clinic Address"
                value={hospitalAddress}
                onChange={(e) => setHospitalAddress(e.target.value)}
                inputProps={{ "data-cy": "hospital-address-input" }} // ✅ Add this
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Upload Verification Documents (PDF, JPG, PNG)
            </Typography>
            <FileUpload
              multiple
              onFilesChange={(files) =>
                setDocuments(files.map((f) => f.fileObject))
              }
              maxFiles={5}
              accept={["application/pdf", "image/jpeg", "image/png"]}
              helperText="Drag & drop files or click to browse"
              autoUpload={false}
            />
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}

          <Grid item xs={12} textAlign="right">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              size="large"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default DoctorOnBoarding;
