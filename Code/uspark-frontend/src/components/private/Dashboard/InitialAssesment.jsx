/**
 * @file InitialAssessmentCard Component
 *
 * @namespace src.components.private.Dashboard.InitialAssessmentCard
 * @memberof src.components.private.Dashboard
 *
 * This component displays a card to trigger an initial assessment form for patients.
 * It opens a dialog where users can fill in assessment details and comments.
 * Currently, it logs the data to console on submission and can be extended for backend integration.
 */

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ResponsiveField from "../../../utils/components/ResponsiveField";

/**
 * InitialAssessmentCard Component
 *
 * @memberof src.components.private.Dashboard.InitialAssessmentCard
 *
 * @returns {JSX.Element} - A card with a form dialog that allows patients to
 * submit initial assessment details and comments.
 *
 * @example
 * <InitialAssessmentCard />
 */

const InitialAssessmentCard = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    assessment: "",
    comments: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Submitted:", formData);
    handleClose();
  };

  return (
    <>
      <Card
        elevation={3}
        sx={{
          p: 2,
          mt: 3,
          borderRadius: 3,
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={500}>
          Initial Assessment
        </Typography>
        <IconButton onClick={handleOpen} color="primary" sx={{ ml: "auto" }}>
          <AddIcon />
        </IconButton>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Initial Assessment Form</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <ResponsiveField
                label="Assessment Detail"
                name="assessment"
                required
                value={formData.assessment}
                onChange={handleChange}
                inputProps={{ "data-cy": "assessment-detail" }}
              />
              <ResponsiveField
                label="Comments"
                name="comments"
                required
                value={formData.comments}
                onChange={handleChange}
                inputProps={{ "data-cy": "assessment-comments" }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default InitialAssessmentCard;
