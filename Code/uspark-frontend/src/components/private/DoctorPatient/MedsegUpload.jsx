import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CardMedia,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
  fetchSegmentations,
  resegmentImage,
  deleteSegmentedImage,
  doctorUpload,
} from "../../../store/actions";
import dayjs from "dayjs";

const MedsegUpload = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const token = useSelector((state) => state.auth.token);
  const { segmentations, loading } = useSelector((state) => state.medseg);

  const [file, setFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterDate, setFilterDate] = useState(""); // State for filtering by date

  useEffect(() => {
    if (token) {
      dispatch(fetchSegmentations({ token }));
    }
  }, [dispatch, token]);

  const handleUpload = async () => {
    if (!file) {
      enqueueSnackbar("Please select a file to upload.", { variant: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await dispatch(doctorUpload({ formData, token }));
      enqueueSnackbar("Image uploaded successfully!", { variant: "success" });

      // Fetch the updated list of segmentations
      dispatch(fetchSegmentations({ token }));
    } catch (error) {
      enqueueSnackbar("Failed to upload the image.", { variant: "error" });
    }
  };

  const handleResegment = (imageUrl) => {
    dispatch(resegmentImage({ imageUrl, token }));
    enqueueSnackbar("Image resegmented successfully!", { variant: "success" });

    // Fetch the updated list of segmentations
    dispatch(fetchSegmentations({ token }));
  };

  const handleDeleteClick = (url) => {
    setSelectedImage(url);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteSegmentedImage({ segmentedUrl: selectedImage, token }));
    setOpenDialog(false);
    enqueueSnackbar("Image deleted successfully!", { variant: "success" });

    // Fetch the updated list of segmentations
    dispatch(fetchSegmentations({ token }));
  };

  // Filter segmentations based on the selected date
  const filteredSegmentations = segmentations.filter((segmentation) => {
    if (!filterDate) return true;
    const uploadedDate = dayjs(segmentation.uploadedAt).format("YYYY-MM-DD");
    return uploadedDate === filterDate;
  });

  return (
    <Box mt={4} ml={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Upload and Manage Segmentations
      </Typography>

      {/* Upload Section */}
      <Box mb={4} display="flex" alignItems="center" gap={2}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
          id="upload-input"
        />
        <label htmlFor="upload-input">
          <Button variant="contained" component="span">
            Choose File
          </Button>
        </label>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file}
        >
          Upload
        </Button>
      </Box>

      {/* Filter Section */}
      <Box mb={4} display="flex" alignItems="center" gap={2}>
        <TextField
          label="Filter by Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          sx={{ width: "250px" }}
        />
        <Button
          variant="outlined"
          onClick={() => setFilterDate("")}
          disabled={!filterDate}
        >
          Clear Filter
        </Button>
      </Box>

      {/* Segmented Images Section */}
      <Typography variant="h6" gutterBottom>
        Segmented Images
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filteredSegmentations.length > 0 ? (
        <Box>
          {filteredSegmentations.map((segmentation, idx) => (
            <Box
              key={segmentation._id}
              display="flex"
              alignItems="center"
              gap={2}
              mb={4}
              mr={4}
              sx={{
                position: "relative",
                backgroundColor: theme.palette.background.default,
                borderRadius: 2,
                boxShadow: theme.shadows[3],
                p: 2,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  mt: 2,
                  mr: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Uploaded At:{" "}
                  {dayjs(segmentation.uploadedAt).format("YYYY-MM-DD HH:mm:ss")}
                </Typography>
              </Box>
              {/* Original Image */}
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Original Image
                </Typography>
                <CardMedia
                  component="img"
                  image={segmentation.originalImage}
                  alt={`Original ${idx}`}
                  sx={{
                    maxHeight: 200,
                    maxWidth: 400,
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                />
              </Box>

              {/* Arrow */}
              <Typography variant="h6" color="text.secondary">
                →
              </Typography>

              {/* Segmented Image */}
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Segmented Image
                </Typography>
                <CardMedia
                  component="img"
                  image={segmentation.segmentedImage}
                  alt={`Segmented ${idx}`}
                  sx={{
                    maxHeight: 200,
                    maxWidth: 600,
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                />
              </Box>

              {/* Actions */}
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleResegment(segmentation.originalImage)}
                >
                  Resegment
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteClick(segmentation.segmentedImage)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary" mt={4}>
          No segmented images found. Upload a file to get started.
        </Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this segmented image?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedsegUpload;
