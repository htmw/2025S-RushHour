// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid2,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setUserAuth } from "../../store/authSlice";
import { enqueueSnackbar } from "notistack";

import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";

// ✅ Firebase Auth Imports
import {
  auth,
  googleProvider,
  appleProvider,
  signInWithPopup,
} from "../../firebase/firebase";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // ✅ Handle Email/Password Login
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/auth", {
        email: form.email,
        password: form.password,
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
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      enqueueSnackbar(
        err.response?.data?.message || "Invalid email or password",
        {
          variant: "error",
        }
      );
    }
  };

  // ✅ Handle Google/Apple OAuth Login
  const handleOAuthLogin = async (provider) => {
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
      console.error("OAuth login error:", err);
      setError("Social login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h5" gutterBottom>
          Login to Your Account
        </Typography>

        {/* ✅ Email/Password Form */}
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
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
          <Grid2 size={12}>
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
          Login
        </Button>

        <Divider style={{ margin: "20px 0" }}>OR</Divider>

        {/* ✅ Google Login Button */}
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          startIcon={<GoogleIcon />}
          style={{ marginBottom: 10 }}
          onClick={() => handleOAuthLogin(googleProvider)}
        >
          Sign in with Google
        </Button>

        {/* ✅ Apple Login Button */}
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          startIcon={<AppleIcon />}
          onClick={() => handleOAuthLogin(appleProvider)}
        >
          Sign in with Apple
        </Button>

        <Typography variant="body2" align="center" style={{ marginTop: 10 }}>
          Don't have an account?{" "}
          <Button color="primary" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
