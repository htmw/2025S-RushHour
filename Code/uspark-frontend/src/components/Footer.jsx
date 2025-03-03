import React from "react";
import { Container, Grid, Typography, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "#fff",
        mt: 4,      // Increased top margin
        py: 3,      // Vertical padding
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* App Name / Logo */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Uspark
            </Typography>
            <Typography variant="body2">
              Connecting patients and doctors seamlessly using AI-driven
              solutions.
            </Typography>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} sm={4}>
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
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box textAlign="center" mt={3}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Uspark. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
