import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import "../../../css/InsuranceCard.css";

const InsuranceCard = () => {
  const [insuranceDetails, setInsuranceDetails] = useState({
    providerName: "",
    startDate: "",
    endDate: "",
    holderName: "",
  });

  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const token = useSelector((state) => state.auth?.token);

  // Fetch insurance details
  const fetchInsuranceDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/insurance", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.error) {
        enqueueSnackbar(response.data.message, { variant: "error" });
      } else {
        const { providerName, startDate, endDate, holderName } = response.data;
        setInsuranceDetails({
          providerName,
          startDate: new Date(startDate).toISOString().split("T")[0], // Format date to YYYY-MM-DD
          endDate: new Date(endDate).toISOString().split("T")[0],
          holderName,
        });
      }
    } catch (error) {
      console.error("Error fetching insurance details:", error);
      enqueueSnackbar("Error fetching insurance details", { variant: "error" });
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setInsuranceDetails({
      ...insuranceDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Save insurance details
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/insurance",
        insuranceDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.error) {
        enqueueSnackbar(response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Insurance details saved successfully!", {
          variant: "success",
        });
        setIsEditing(false); // Switch back to view mode after saving
      }
    } catch (error) {
      console.error("Error saving insurance details:", error);
      enqueueSnackbar("Error saving insurance details", { variant: "error" });
    }
  };

  // Fetch insurance details on mount
  useEffect(() => {
    fetchInsuranceDetails();
  }, []);

  return (
    <Card className="insurance-card">
      <CardContent>
        {/* Edit Icon */}
        {!isEditing && (
          <IconButton className="edit-icon" onClick={() => setIsEditing(true)}>
            <EditIcon />
          </IconButton>
        )}

        <Typography className="insurance-title">Insurance Details</Typography>

        {isEditing ? (
          // Edit Mode - Show Form
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Provider Name"
                  name="providerName"
                  variant="outlined"
                  fullWidth
                  value={insuranceDetails.providerName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Start Date"
                  type="date"
                  name="startDate"
                  variant="outlined"
                  fullWidth
                  value={insuranceDetails.startDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="End Date"
                  type="date"
                  name="endDate"
                  variant="outlined"
                  fullWidth
                  value={insuranceDetails.endDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Holder Name"
                  name="holderName"
                  variant="outlined"
                  fullWidth
                  value={insuranceDetails.holderName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button className="save-button" type="submit" fullWidth>
                  <SaveIcon sx={{ mr: 1 }} /> Save Details
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          // View Mode - Show Static Data
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography className="insurance-field">
                <strong>Provider:</strong>{" "}
                {insuranceDetails.providerName || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className="insurance-field">
                <strong>Start Date:</strong>{" "}
                {insuranceDetails.startDate || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className="insurance-field">
                <strong>End Date:</strong> {insuranceDetails.endDate || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className="insurance-field">
                <strong>Holder Name:</strong>{" "}
                {insuranceDetails.holderName || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default InsuranceCard;
