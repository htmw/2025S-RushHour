/**
 * @fileoverview Contact Us page component for Uspark.
 * Provides contact options, a contact form, and frequently asked questions.
 */

import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid2,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
} from "@mui/material";
import { motion } from "framer-motion";

/**
 * ContactUs Component
 *
 * Displays contact options, a contact form, and an FAQ section.
 *
 * @component
 * @returns {JSX.Element} The Contact Us page.
 */
const ContactUs = () => {
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
          Contact Us
        </Typography>
        <Typography variant="h5" color="textSecondary" mt={2}>
          We're here to assist you with any inquiries or support you may need.
        </Typography>
      </Box>

      {/* Contact Options */}
      <Grid2 container spacing={5} alignItems="flex-start">
        {/* Product & Sales Enquiries */}
        <Grid2 item size={{ xs: 12, md: 6 }}>
          <Card
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight={600} mb={2}>
                Product & Sales Enquiries
              </Typography>
              <Typography variant="body1" color="textSecondary" mb={2}>
                Have questions about our products or pricing? Our sales team is
                here to help.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href="mailto:sales@uspark.com"
              >
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* Technical Support */}
        <Grid2 item size={{ xs: 12, md: 6 }}>
          <Card
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight={600} mb={2}>
                Technical Support
              </Typography>
              <Typography variant="body1" color="textSecondary" mb={2}>
                Need assistance with our application? Our support team is ready
                to assist you.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href="mailto:support@uspark.com"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Divider sx={{ my: 5 }} />

      {/* Contact Form */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={600} textAlign="center" mb={3}>
          Send Us a Message
        </Typography>
        <Grid2 container justifyContent="center">
          <Grid2 item xs={12} md={8}>
            <Card>
              <CardContent>
                <form noValidate autoComplete="off">
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    variant="outlined"
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    variant="outlined"
                    margin="normal"
                    multiline
                    rows={4}
                    required
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      </Box>

      <Divider sx={{ my: 5 }} />

      {/* Frequently Asked Questions */}
      <Box>
        <Typography variant="h4" fontWeight={600} textAlign="center" mb={3}>
          Frequently Asked Questions
        </Typography>
        <Grid2 container spacing={3}>
          {/* FAQ 1 */}
          <Grid2 item size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight={500}>
              Can anyone start a free trial for Uspark?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Uspark is designed for businesses, non-profits, and educational
              institutions. Individual users are currently not supported. If you
              represent an organization, you should be an administrator to start
              the free trial.{" "}
              <Link href="/faq" color="primary">
                Learn more
              </Link>
              .
            </Typography>
          </Grid2>
          {/* FAQ 2 */}
          <Grid2 item size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight={500}>
              Are there any discounts for non-profits and educational
              institutions?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Yes, we offer special pricing for non-profits and educational
              institutions. Please{" "}
              <Link href="/pricing" color="primary">
                contact our sales team
              </Link>{" "}
              for more details.
            </Typography>
          </Grid2>
          {/* FAQ 3 */}
          <Grid2 item size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" fontWeight={500}>
              How do I upgrade to a paid version of Uspark?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              To upgrade, create an account by signing up for a 30-day free
              trial. After setting up a backup job, navigate to the
              subscriptions page and submit an upgrade request. You will receive
              a payment link within 24 hours to complete the process.
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
    </Container>
  );
};

export default ContactUs;
