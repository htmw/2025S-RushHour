import React, { useState, useEffect } from "react";
import {
  Avatar,
  IconButton,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { Edit, PhotoCamera } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { uploadProfileImage, fetchProfileImage } from "../../../store/actions";

const Imageupload = ({ userData, fromProfilePage }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const imageUrl = useSelector((state) => state.profile?.imageUrl);
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!fromProfilePage) {

      dispatch(fetchProfileImage());
    }
  }, [dispatch]);

  useEffect(() => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
    }
  }, [imageUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!selectedImage) return alert("Please select an image.");
    const formData = new FormData();
    formData.append("profileImage", selectedImage);
    dispatch(uploadProfileImage(formData));
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelectedImage(null);
    setPreviewImage(imageUrl || null);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 4,
        textAlign: "center",
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 2px 14px rgba(255, 255, 255, 0)"
            : "0 2px 14px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Typography
        variant="h6"
        color="primary"
        fontWeight={700}
        sx={{ letterSpacing: 1.5 }}
        gutterBottom
        data-cy="upload-profile-title"
      >
        Profile Picture
      </Typography>

      <Box sx={{ position: "relative", display: "inline-block" }}>
        <Avatar
          src={previewImage}
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            bgcolor: "primary.main",
            fontSize: 32,
          }}
          data-cy="profile-avatar"
        >
          {!previewImage && userData.fullName.charAt(0)}
        </Avatar>

        {editMode ? (
          <>
            <input
              accept="image/*"
              type="file"
              id="upload-profile-image"
              style={{ display: "none" }}
              onChange={handleImageChange}
              data-cy="profile-image-input"
            />
            <label htmlFor="upload-profile-image">
              <IconButton
                color="primary"
                component="span"
                sx={{
                  position: "absolute",
                  bottom: -10,
                  right: -10,
                  bgcolor: "white",
                  border: "1px solid #ccc",
                  boxShadow: 1,
                  ":hover": { bgcolor: "#f0f0f0" },
                }}
                data-cy="edit-profile-image-button"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </>
        ) : (
          <IconButton
            onClick={() => setEditMode(true)}
            sx={{
              position: "absolute",
              bottom: -10,
              right: -10,
              bgcolor: "white",
              border: "1px solid #ccc",
              boxShadow: 1,
              ":hover": { bgcolor: "#f0f0f0" },
            }}
            data-cy="edit-profile-image-button"
          >
            <Edit color="primary" />
          </IconButton>
        )}
      </Box>

      {editMode && (
        <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
          <Button
            variant="contained"
            color="secondary"
            data-cy="upload-image-button"
            onClick={handleUpload}
          >
            Upload
          </Button>
          <Button
            variant="outlined"
            color="error"
            data-cy="cancel-image-upload"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Stack>
      )}
    </Paper>
  );
};

export default Imageupload;
