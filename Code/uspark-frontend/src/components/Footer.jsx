import React from "react";
import {
  Container,
  Grid2,
  Typography,
  Link,
  IconButton,
  Box,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        mt: 4,
        py: 4,
        borderTopWidth: 1,
        borderTopColor: "background.paper",
        borderTopStyle: "solid",
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={4} justifyContent="center">
          {/* Brand Section */}
          <Grid2
            size={{ xs: 12, sm: 4 }}
            textAlign={{ xs: "center", sm: "left" }}
          >
            <Typography variant="h6" fontWeight="bold">
              Uspark
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Connecting patients and doctors seamlessly using AI-driven
              solutions.
            </Typography>
          </Grid2>

          {/* Quick Links */}
          <Grid2 size={{ xs: 12, sm: 4 }} textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              Quick Links
            </Typography>
            <Box sx={{ mt: 1 }}>
              {["Home", "About Us", "Contact", "FAQ"].map((text) => (
                <Link
                  key={text}
                  href={`/${text.toLowerCase().replace(/\s+/g, "")}`}
                  color="inherit"
                  underline="hover"
                  sx={{ mx: 1.5, fontSize: "0.95rem" }}
                >
                  {text}
                </Link>
              ))}
            </Box>
          </Grid2>

          {/* Social Media */}
          <Grid2
            size={{ xs: 12, sm: 4 }}
            textAlign={{ xs: "center", sm: "right" }}
          >
            <Typography variant="h6" fontWeight="bold">
              Follow Us
            </Typography>
            <Box sx={{ mt: 1 }}>
              {[
                { icon: <FacebookIcon />, url: "https://facebook.com" },
                { icon: <TwitterIcon />, url: "https://twitter.com" },
                { icon: <LinkedInIcon />, url: "https://linkedin.com" },
                { icon: <InstagramIcon />, url: "https://instagram.com" },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  href={social.url}
                  target="_blank"
                  sx={{
                    color: "text.primary",
                    mx: 0.5,
                    transition: "0.3s",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid2>
        </Grid2>

        {/* Footer Bottom */}
        <Box textAlign="center" sx={{ mt: 3, color: "text.secondary" }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Uspark. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
