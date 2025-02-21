// src/components/Footer.jsx
import React from "react";
import { Container, Grid2, Typography, Link, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "primary.main", color: "#fff", marginTop: "10px" }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={4}>
          {/* App Name / Logo */}
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" gutterBottom>
              Uspark
            </Typography>
            <Typography variant="body2">
              Connecting patients and doctors seamlessly using AI-driven
              solutions.
            </Typography>
          </Grid2>

          {/* Navigation Links */}
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Grid2 container>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <Link href="/home" color="inherit" underline="hover">
                  Home
                </Link>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <Link href="/about" color="inherit" underline="hover">
                  About Us
                </Link>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <Link href="/contact" color="inherit" underline="hover">
                  Contact
                </Link>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 3 }}>
                <Link href="/faq" color="inherit" underline="hover">
                  FAQ
                </Link>
              </Grid2>
            </Grid2>
          </Grid2>

          {/* Social Media */}
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <IconButton
              color="inherit"
              href="https://facebook.com"
              target="_blank"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://twitter.com"
              target="_blank"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://linkedin.com"
              target="_blank"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://instagram.com"
              target="_blank"
            >
              <InstagramIcon />
            </IconButton>
          </Grid2>
        </Grid2>

        {/* Footer Bottom */}
        <Box textAlign="center" mb={2}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Uspark. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
