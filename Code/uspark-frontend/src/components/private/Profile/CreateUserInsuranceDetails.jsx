import React, { useState, useEffect } from "react";
import { Paper, Typography, Stack, Button } from "@mui/material";
import ResponsiveField from "../../../utils/components/ResponsiveField.jsx";
import { useDispatch, useSelector } from "react-redux";
import { createInsurance } from "../../../store/actions/index.js";

const CreateInsuranceDetails = ({ userData }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.insurance.loading);
  const insuranceData = useSelector((state) => state.insurance.data);

  const [formData, setFormData] = useState({
    providerName: "",
    startDate: "",
    endDate: "",
    holderName: userData?.fullName || "",
  });



  useEffect(() => {
    if (insuranceData && !insuranceData.error) {
      setFormData({
        providerName: insuranceData.providerName || "",
        startDate: insuranceData.startDate?.slice(0, 10) || "",
        endDate: insuranceData.endDate?.slice(0, 10) || "",
        holderName: insuranceData.holderName || userData?.fullName || "",
      });
    }
  }, [insuranceData, userData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    dispatch(createInsurance(formData));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: "10px", width: "99%" }}>
      <Typography variant="h5" gutterBottom data-cy="insurance-title">
        Insurance Details
      </Typography>

      <Stack spacing={2} mt={2}>
        <ResponsiveField
          label="Insurance Provider"
          name="providerName"
          value={formData.providerName}
          onChange={handleChange}
          inputProps={{ "data-cy": "insurance-provider" }}
          required
        />
        <ResponsiveField
          label="Start Date"
          name="startDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.startDate}
          onChange={handleChange}
          inputProps={{ "data-cy": "insurance-start-date" }}
          required
        />
        <ResponsiveField
          label="End Date"
          name="endDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.endDate}
          onChange={handleChange}
          inputProps={{ "data-cy": "insurance-end-date" }}
          required
        />
        <ResponsiveField
          label="Policy Holder Name"
          name="holderName"
          value={formData.holderName}
          onChange={handleChange}
          inputProps={{ "data-cy": "insurance-holder" }}
          required
        />
      </Stack>

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 3 }}
        onClick={handleSave}
        disabled={loading}
        data-cy="save-insurance-button"
      >
        {loading ? "Saving..." : "Save Insurance Details"}
      </Button>
    </Paper>
  );
};

export default CreateInsuranceDetails;
