import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';

const InsuranceCard = () => {
  const [insuranceDetails, setInsuranceDetails] = useState({
    providerName: '',
    startDate: '',
    endDate: '',
    holderName: '',
  });

  const token = useSelector((state) => state.auth?.token);

  // Fetch existing insurance details
  const fetchInsuranceDetails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/insurance', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.error) {
        enqueueSnackbar(response.data.message, { variant: "error" });
      } else {
        // Set the state with data from MongoDB response
        const { providerName, startDate, endDate, holderName } = response.data;
        setInsuranceDetails({
          providerName,
          startDate: new Date(startDate).toISOString().split('T')[0], // Format date to YYYY-MM-DD
          endDate: new Date(endDate).toISOString().split('T')[0],     // Format date to YYYY-MM-DD
          holderName,
        });
        enqueueSnackbar("Insurance Details Fetched Successfully", { variant: "success" });
      }
    } catch (error) {
      console.error('Error fetching insurance details:', error);
      enqueueSnackbar("Error fetching insurance details", { variant: "error" });
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setInsuranceDetails({ ...insuranceDetails, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/insurance', insuranceDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.error) {
        enqueueSnackbar(response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar('Insurance details saved successfully!', { variant: "success" });
      }
    } catch (error) {
      console.error('Error saving insurance details:', error);
      enqueueSnackbar("Error saving insurance details", { variant: "error" });
    }
  };

  // Fetch insurance details on component mount
  useEffect(() => {
    fetchInsuranceDetails();
  }, []);

  return (
    <Card sx={{ maxWidth: 400, margin: '20px auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Insurance Details
        </Typography>
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
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Save Details
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default InsuranceCard;
