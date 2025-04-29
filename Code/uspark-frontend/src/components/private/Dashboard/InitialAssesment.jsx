import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  IconButton,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssessments } from "../../../store/actions";
import { useNavigate } from "react-router-dom";

const InitialAssessmentCard = ({ openChat }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assessments, loading, error } = useSelector(
    (state) => state.assessments
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);

  const handleOpenModal = (messages) => {
    setSelectedMessages(messages);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    // Fetch assessments if not already present
    if (!assessments || assessments.length === 0) {
      dispatch(fetchAssessments());
    }
  }, [dispatch, assessments]);

  // Get the last assessment if available
  const lastAssessment = assessments?.length > 0 ? assessments[0] : null;

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
          {assessments?.length === 0 ? "Initial Assessments" : "My Assessments"}
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

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : lastAssessment ? (
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: "grey.100",
          }}
        >
          <Typography fontWeight={600}>
            Outcome: {lastAssessment.outcome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {new Date(lastAssessment.createdAt).toLocaleDateString()} -
            Time:{" "}
            {new Date(lastAssessment.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ mt: 1, fontStyle: "italic" }}
          >
            Last Response:{" "}
            {lastAssessment.messages[lastAssessment.messages.length - 1]
              ?.text || "No response"}
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ mt: 1, cursor: "pointer" }}
            onClick={() => handleOpenModal(lastAssessment.messages)}
          >
            View Full Conversation
          </Typography>
        </Paper>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No assessments yet.
        </Typography>
      )}

      {/* View All Assessments Button */}
      <Button
        variant="outlined"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => navigate("/assessments")}
      >
        View All Assessments
      </Button>

      {/* Modal for full chat view */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            borderBottom: "1px solid #ccc",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Full Chat Conversation
          </Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent dividers>
          <Stack spacing={2}>
            {selectedMessages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "bot" ? "flex-start" : "flex-end",
                }}
              >
                <Box
                  sx={{
                    maxWidth: "70%",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor:
                      message.sender === "bot" ? "grey.300" : "primary.light",
                    color: message.sender === "bot" ? "primary.main" : "white",

                    boxShadow: 2,
                  }}
                >
                  <Typography variant="body2">{message.text}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default InitialAssessmentCard;
