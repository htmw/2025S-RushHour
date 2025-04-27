import React, { useState } from "react";
import {
  Paper,
  Typography,
  IconButton,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const InitialAssessmentCard = ({ openChat, assessmentList }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState("");

  const handleOpenModal = (summary) => {
    setSelectedSummary(summary);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mt: 3,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontWeight={500}>
          Initial Assessments
        </Typography>
        <IconButton
          onClick={openChat}
          color="primary"
          sx={{
            backgroundColor: "action.hover",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "white",
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Stack spacing={2}>
        {assessmentList.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No assessments yet.
          </Typography>
        ) : (
          assessmentList.map((item) => (
            <Paper
              key={item.number}
              sx={{ p: 2, cursor: "pointer" }}
              onClick={() => handleOpenModal(item.fullSummary)}
            >
              <Typography fontWeight={600}>
                Assessment #{item.number}
              </Typography>
              <Typography variant="body2">
                Time: {item.date}, {item.time}
              </Typography>
              <Typography variant="body2">
                Summary:{" "}
                {item.fullSummary
                  .split("\n")
                  [item.fullSummary.split("\n").length - 1].slice(0, 50)}
                ...
              </Typography>
            </Paper>
          ))
        )}
      </Stack>

      {/* Modal for full chat view */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Full Chat Summary</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {selectedSummary.split("\n").map((line, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: line.startsWith("Doctor:")
                    ? "primary.light"
                    : "grey.300",
                  color: "black",
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: "75%",
                  alignSelf: line.startsWith("Doctor:")
                    ? "flex-start"
                    : "flex-end",
                }}
              >
                <Typography variant="body2">{line.trim()}</Typography>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default InitialAssessmentCard;
