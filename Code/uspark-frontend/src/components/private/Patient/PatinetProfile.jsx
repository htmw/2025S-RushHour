import React, { useEffect, useState } from "react";
import { Typography, Button, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard, uploadProfileImage } from "../../../store/actions";
import { useNavigate } from "react-router-dom";
import PatientLayout from "./PatLayout";

const PatientProfile = () => {
  const navigate = useNavigate();
  const { userData, loading } = useSelector((state) => state.dashboard);
  const token = useSelector((state) => state.auth?.token);
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(fetchDashboard({ token }));
    }
  }, [token]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the image
      const formData = new FormData();
      formData.append("profileImage", file);
      dispatch(uploadProfileImage({ formData, token }));
    }
  };

  if (loading) {
    return (
      <PatientLayout>
        <div>Loading...</div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <Typography variant="h5">Patient Profile</Typography>
      <Avatar
        src={
          (userData && userData.profileImage) || image || "/default-profile.png"
        }
        alt="Profile"
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        id="upload-button"
      />
      <label htmlFor="upload-button">
        <Button variant="contained" component="span">
          Upload Profile Image
        </Button>
      </label>
      <Typography>Name: {userData?.fullName}</Typography>
      <Typography>Age: {userData?.age}</Typography>
      <Typography>Sex: {userData?.sex}</Typography>
      <Typography>Height: {userData?.height} cm</Typography>
      <Typography>Weight: {userData?.weight} kg</Typography>
      <Typography>
        Health Issues: {userData?.healthIssues?.join(", ") || "N/A"}
      </Typography>
    </PatientLayout>
  );
};

export default PatientProfile;
