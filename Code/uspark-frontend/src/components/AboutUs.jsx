import React from "react";
import { Typography, Box, Container, Paper } from "@mui/material";
import PatientLayout from "../pages/Patient/PatLayout";

const AboutUs = () => {
  return (
    <PatientLayout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Welcome to our healthcare platform! We are dedicated to providing an easy and efficient way for patients to manage their medical records, book appointments, and stay informed about their health.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Our mission is to bridge the gap between patients and healthcare providers through technology, ensuring better accessibility and improved patient care.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            If you have any questions or need assistance, feel free to reach out to us. Your health and convenience are our top priorities!
          </Typography>
        </Paper>
      </Container>
    </PatientLayout>
  );
};

export default AboutUs;
