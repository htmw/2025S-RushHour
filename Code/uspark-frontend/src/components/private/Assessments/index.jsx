import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssessments, deleteAssessment } from "../../../store/actions";
import CloseIcon from "@mui/icons-material/Close";

const Assessments = () => {
  const dispatch = useDispatch();
  const { assessments, loading, error } = useSelector(
    (state) => state.assessments
  );

  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);

  useEffect(() => {
    // Fetch all assessments when the component mounts
    dispatch(fetchAssessments());
  }, [dispatch]);

  useEffect(() => {
    // Update filtered assessments when assessments change
    setFilteredAssessments(assessments);
  }, [assessments]);

  const handleFilter = () => {
    if (filterDate || filterTime) {
      const filtered = assessments.filter((a) => {
        const assessmentDate = new Date(a.createdAt);
        const matchesDate =
          filterDate &&
          assessmentDate.toLocaleDateString() ===
            new Date(filterDate).toLocaleDateString();
        const matchesTime =
          filterTime &&
          assessmentDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) === filterTime;
        return (
          (filterDate ? matchesDate : true) && (filterTime ? matchesTime : true)
        );
      });
      setFilteredAssessments(filtered);
    } else {
      setFilteredAssessments(assessments);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteAssessment(id));
    setDeleteDialogOpen(false);
  };

  const handleViewConversation = (messages) => {
    setSelectedMessages(messages);
    setViewDialogOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My Assessments
        </Typography>

        {/* Filter Section */}
        <Box display="flex" gap={2} mb={3}>
          <TextField
            type="date"
            label="Filter by Date"
            InputLabelProps={{ shrink: true }}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <TextField
            type="time"
            label="Filter by Time"
            InputLabelProps={{ shrink: true }}
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
          />
          <Button variant="contained" onClick={handleFilter}>
            Apply Filter
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setFilterDate("");
              setFilterTime("");
              setFilteredAssessments(assessments);
            }}
          >
            Clear Filter
          </Button>
        </Box>

        {/* Assessments List */}
        <Stack spacing={2}>
          {loading ? (
            <Typography variant="body2" color="text.secondary">
              Loading assessments...
            </Typography>
          ) : error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : filteredAssessments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No assessments found.
            </Typography>
          ) : (
            filteredAssessments.map((assessment) => {
              const lastMessage =
                assessment.messages[assessment.messages.length - 1]?.text ||
                "No response";
              const createdAt = new Date(assessment.createdAt);
              return (
                <Paper key={assessment._id} sx={{ p: 2, borderRadius: 3 }}>
                  <Typography fontWeight={600}>
                    Outcome: {assessment.outcome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {createdAt.toLocaleDateString()} - Time:{" "}
                    {createdAt.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ mt: 1, fontStyle: "italic" }}
                  >
                    Last Response: {lastMessage}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() =>
                        handleViewConversation(assessment.messages)
                      }
                    >
                      View Full Conversation
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => {
                        setSelectedAssessment(assessment);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              );
            })
          )}
        </Stack>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this assessment?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={() => handleDelete(selectedAssessment._id)}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Full Conversation Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
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
            <IconButton onClick={() => setViewDialogOpen(false)}>
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
                      color:
                        message.sender === "bot" ? "primary.main" : "white",
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
      </Box>
    </Container>
  );
};

export default Assessments;
