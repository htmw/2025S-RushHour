/**
 * @file About Us page for Uspark.
 * Provides information about the organization's journey, solutions, team, vision, and contact details.
 *
 * @namespace src.components.public.AboutUs
 * @memberof src.components.public
 */

import React from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";

/**
 * AboutUs Component
 *
 * Displays the history, solutions, team, vision, and contact details of Uspark.
 *
 * @component
 * @memberof src.components.public.AboutUs
 * @returns {JSX.Element} The About Us page.
 */
const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ pt: 5 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={5}>
        <Typography
          variant="h2"
          fontWeight={700}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Welcome to Uspark
        </Typography>
        <Typography variant="h5" color="textSecondary" mt={2}>
          Revolutionizing Healthcare with AI-Powered Solutions
        </Typography>
      </Box>

      {/* Journey Section */}
      <Grid container spacing={5} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight={600}>
            Our Journey
          </Typography>
          <Typography variant="body1" mt={2} color="textSecondary">
            Uspark was conceived as a capstone project at Pace University,
            driven by a team of dedicated students passionate about leveraging
            technology to simplify healthcare management. Our mission is to
            bridge the gap between technology and healthcare, offering AI-driven
            solutions that enhance patient experiences and optimize healthcare
            operations.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            src="./animations/1.jpg"
            alt="Our Journey"
            style={{
              width: "80%", // Adjust width as needed
              height: "auto", // Maintain aspect ratio
              maxWidth: "400px", // Limit max size
              borderRadius: "12px",
              display: "block",
              margin: "auto",
            }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* Solutions Section */}
      <Box textAlign="center" mb={5}>
        <Typography variant="h4" fontWeight={600}>
          Our Solutions
        </Typography>
      </Box>
      <Grid container spacing={5}>
        {/* Uheal */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={600}>
                Uheal
              </Typography>
              <Typography variant="body1" mt={2} color="textSecondary">
                Uheal is an AI-powered virtual assistant that helps users
                schedule appointments, conduct preliminary health assessments,
                and receive instant guidance tailored to their needs. By
                integrating chatbot technology, we enhance accessibility and
                efficiency in healthcare interactions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Useg */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={600}>
                Useg
              </Typography>
              <Typography variant="body1" mt={2} color="textSecondary">
                Useg is a cutting-edge machine learning model designed for
                biomedical image analysis. By generating heat maps and
                segmenting images, Useg assists healthcare professionals in
                diagnosing conditions with greater accuracy and efficiency.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* Team Section */}
      <Box textAlign="center" mb={5}>
        <Typography variant="h4" fontWeight={600}>
          Meet Our Team
        </Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        {[
          {
            name: "Rathan Jayanath Singavarapu",
            role: "Team Lead/Scrum Master/Full Stack Developer",
          },
          { name: "Koundinya Pidaparthy", role: "Lead Full Stack Developer" },
          {
            name: "Avinash Manchala",
            role: "Full Stack Developer/UI Designer",
          },
          {
            name: "Murali Kummari",
            role: "AI & ML Engineer & Tester",
          },
          {
            name: "Uday Kumar Reddy L",
            role: "AI & ML Engineer & Tester",
          },
          {
            name: "Pranay Kumar Reddy Chamala",
            role: "AI & ML Lead Engineer",
          },
          {
            name: "Sairam Maddela",
            role: "Full Stack Testing Engineer",
          },
          { name: "Sujit Suprabhat Tubki", role: "Full Stack Tester" },
        ].map((member, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent style={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight={500}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {member.role}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* Vision Section */}
      <Box textAlign="center" mb={5}>
        <Typography variant="h4" fontWeight={600}>
          Our Vision
        </Typography>
        <Typography variant="body1" mt={2} color="textSecondary">
          At Uspark, we envision a future where AI-driven healthcare solutions
          empower individuals and professionals alike. By integrating advanced
          technology into the healthcare ecosystem, we strive to enhance patient
          experiences, optimize workflows, and drive innovation in the medical
          field.
        </Typography>
      </Box>

      {/* Contact Section */}
      <Box textAlign="center">
        <Typography variant="h4" fontWeight={600}>
          Contact Us
        </Typography>
        <Typography variant="body1" mt={2} color="textSecondary">
          Have questions or want to collaborate? Reach out to us at{" "}
          <strong>TeamUspark@gmail.com</strong>. We'd love to hear from you!
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
