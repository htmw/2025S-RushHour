/**
 * @file Profile image upload component.
 *
 * Allows users to upload and preview profile images.
 *
 * @namespace src.components.private.Dashboard.Imageupload
 * @memberof src.components.private.Dashboard
 */

import React, { useState, useEffect } from "react";
import { Avatar, IconButton, Button } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { uploadProfileImage } from "../../../store/actions";

/**
 * Imageupload Component
 *
 * Handles profile image selection, preview, and upload.
 *
 * @component
 * @memberof src.components.private.Dashboard.Imageupload
 * @param {Object} props - Component props.
 * @param {Object} props.userData - The logged-in user's data.
 * @param {string} props.userData.image - URL of the user's profile image.
 * @param {string} props.userData.fullName - Full name of the user.
 * @param {string} props.userData.userId - Unique user identifier.
 * @returns {JSX.Element} The profile image upload component.
 */
const Imageupload = ({ userData }) => {
  /** @property {File} */
  const [selectedImage, setSelectedImage] = useState(null);

  /** @property {string} */
  const [previewImage, setPreviewImage] = useState(userData?.image || null);

  const dispatch = useDispatch();

  /** @property {string} */
  const imageUrl = useSelector((state) => state.profile?.imageUrl || null);

  /**
   * Updates the preview image when the uploaded image URL changes.
   *
   * @function
   * @memberof src.components.private.Dashboard.Imageupload
   * @effect Runs when `imageUrl` changes.
   */
  useEffect(() => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
      setSelectedImage(null); // Reset selected image after successful upload
    }
  }, [imageUrl]);

  /**
   * Handles image selection and updates the preview.
   *
   * @function
   * @memberof src.components.private.Dashboard.Imageupload
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  /**
   * Handles profile image upload.
   *
   * @function
   * @memberof src.components.private.Dashboard.Imageupload
   */
  const handleUpload = () => {
    if (!selectedImage) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("profileImage", selectedImage);
    formData.append("userId", userData.userId);

    dispatch(uploadProfileImage(formData));
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

export default Imageupload;
