// src/components/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid2,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserAuth } from "../../store/authSlice";

// ✅ Firebase Auth Imports
import {
  auth,
  googleProvider,
  appleProvider,
  signInWithPopup,
} from "../../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // ✅ Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle custom email/password signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // ✅ Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      // ✅ Update user profile with display name
      await updateProfile(user, { displayName: form.name });

      console.log("Firebase User:", user);

      // ✅ Send user data to backend to get JWT
      const backendResponse = await axios.post("http://localhost:5000/auth", {
        email: user.email,
        userId: user.uid,
        fullName: form.name,
      });

      const { token } = backendResponse.data;
      const userPayload = JSON.parse(atob(token.split(".")[1]));

      dispatch(
        setUserAuth({
          token,
          email: userPayload.email,
          fullName: userPayload.fullName,
        })
      );

      // ✅ Redirect to Home
      navigate("/");
    } catch (err) {
      console.error("Sign-up Error:", err);
      setError(err.message || "Sign-up failed");
    }
  };

  // ✅ Handle OAuth signup for Google/Apple
  const handleOAuthSignup = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("OAuth User:", user);

      // ✅ Send user data to backend for JWT generation
      const response = await axios.post("http://localhost:5000/auth/oauth", {
        email: user.email,
        userId: user.uid,
        fullName: user.displayName,
        provider: provider.providerId,
      });

      const { token } = response.data;

      const userPayload = JSON.parse(atob(token.split(".")[1]));

      dispatch(
        setUserAuth({
          token,
          email: userPayload.email,
          fullName: userPayload.fullName,
        })
      );

      // ✅ Redirect to Home
      navigate("/");
    } catch (err) {
      console.error("OAuth signup error:", err);
      setError("Social signup failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h5" gutterBottom>
          Create an Account
        </Typography>

        {/* ✅ Custom Email/Password Signup */}
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </Grid2>
        </Grid2>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: 15 }}
        >
          Sign Up
        </Button>

        <Divider style={{ margin: "20px 0" }}>OR</Divider>

        {/* ✅ Custom Google Signup Button */}
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          startIcon={<GoogleIcon />}
          style={{ marginBottom: 10 }}
          onClick={() => handleOAuthSignup(googleProvider)}
        >
          Sign up with Google
        </Button>

        {/* ✅ Custom Apple Signup Button */}
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          startIcon={<AppleIcon />}
          onClick={() => handleOAuthSignup(appleProvider)}
        >
          Sign up with Apple
        </Button>

        <Typography variant="body2" align="center" style={{ marginTop: 10 }}>
          Already have an account?{" "}
          <Button color="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Signup;
