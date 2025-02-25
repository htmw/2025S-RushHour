import React, { useState } from "react";
import { Avatar, IconButton, Button } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { uploadProfileImageRequest } from "../../store/actions/index"; // Adjust path as necessary

const ProfileImageUpload = ({ userData }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(userData.image || null);
  const dispatch = useDispatch();
  const imageUrl = useSelector((state) => state.profile?.imageUrl || null);


  // Update preview image if imageUrl changes
  React.useEffect(() => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
      setSelectedImage(null); // Reset the selected image after successful upload
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
    formData.append("userId", userData.userId);

    // Dispatch the upload action
    dispatch(uploadProfileImageRequest(formData));
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Avatar
        sx={{ width: 100, height: 100, mx: "auto", bgcolor: "primary.main" }}
        src={previewImage}
      >
        {!previewImage && userData.fullName.charAt(0)}
      </Avatar>

      <input
        accept="image/*"
        type="file"
        id="upload-profile-image"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <label htmlFor="upload-profile-image">
        <IconButton color="primary" component="span" sx={{ mt: 2 }}>
          <PhotoCamera />
        </IconButton>
      </label>

      {selectedImage && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleUpload}
        >
          Upload Image
        </Button>
      )}
    </div>
  );
};

export default ProfileImageUpload;
