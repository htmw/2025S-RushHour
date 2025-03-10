/**
 * @file InsuranceCard Component
 *
 *
 * @namespace src.components.private.Patient.InsuranceCard
 * @memberof src.components.private.Patient
 * This component displays and allows editing of a patient's insurance details.
 * Features include:
 * - Fetching insurance details from an API.
 * - Displaying insurance information in read-only mode.
 * - Allowing users to edit and save their insurance details.
 * - UI feedback via notifications.
 */

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

/**
 *
 * @component
 * @memberof src.components.private.Patient.InsuranceCard
 * @returns {JSX.Element} - The InsuranceCard component displaying and editing insurance details.
 *
 * @example
 * <InsuranceCard />
 */
const InsuranceCard = () => {
  /**
   * State for storing insurance details.
   * @type {Object}
   * @property {string} providerName - Name of the insurance provider.
   * @property {string} startDate - Insurance start date (YYYY-MM-DD format).
   * @property {string} endDate - Insurance end date (YYYY-MM-DD format).
   * @property {string} holderName - Name of the insurance holder.
   */
  const [insuranceDetails, setInsuranceDetails] = useState({
    providerName: "",
    startDate: "",
    endDate: "",
    holderName: "",
  });

  /**
   * State to track whether the component is in edit mode.
   * @type {boolean}
   */
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Retrieves the authentication token from Redux state.
   * @type {string}
   */
  const token = useSelector((state) => state.auth?.token);

  /**
   * Fetches insurance details from the API.
   * Updates `insuranceDetails` state with formatted data.
   */
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
          startDate: new Date(startDate).toISOString().split("T")[0], // Format to YYYY-MM-DD
          endDate: new Date(endDate).toISOString().split("T")[0],
          holderName,
        });
      }
    } catch (error) {
      console.error("Error fetching insurance details:", error);
      enqueueSnackbar("Error fetching insurance details", { variant: "error" });
    }
  };

  /**
   * Handles input changes in the form fields.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object from input change.
   */
  const handleChange = (e) => {
    setInsuranceDetails({
      ...insuranceDetails,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Saves updated insurance details by sending a request to the API.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
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

  /**
   * Fetches insurance details when the component mounts.
   */
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
