/**
 * @file InitialAssessmentCard Component
 *
 *
 * @namespace src.components.private.Patient.InitialAssessmentCard
 *
 * @memberof src.components.private.Patient
 * This component displays an initial assessment card with a button to open
 * a dialog for submitting assessment details.
 *
 * Features:
 * - Displays a card labeled "Initial Assessment".
 * - Allows users to open a dialog to enter assessment details and comments.
 * - Handles form submission and closes the dialog after submission.

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
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

/**
 *
 * @component
 * @memberof src.components.private.Patient.InitialAssessmentCard
 * @returns {JSX.Element} - The InitialAssessmentCard component for submitting assessments.
 *
 * @example
 * <InitialAssessmentCard />
 * */
const InitialAssessmentCard = () => {
  /**
   * State for tracking whether the dialog is open.
   * @type {boolean}
   */
  const [open, setOpen] = useState(false);

  /**
   * Opens the dialog when the add button is clicked.
   */
  const handleOpen = () => {
    setOpen(true);
  };

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Handles form submission and closes the dialog.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    handleClose();
  };

  return (
    <div>
      <Card className="assessment-card">
        <CardContent>
          <Typography variant="h6">Initial Assessment</Typography>
          <IconButton onClick={handleOpen} color="primary">
            <AddIcon />
          </IconButton>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Initial Assessment Form</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              label="Assessment Detail"
              type="text"
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Comments"
              type="text"
              fullWidth
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InitialAssessmentCard;
