// src/components/Signup.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid2,
  Divider,
  CircularProgress,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import { useDispatch, useSelector } from "react-redux";
import { oAuthSignup, signup } from "../../store/actions";

// ✅ Firebase Auth Imports
import {
  auth,
  googleProvider,
  appleProvider,
  signInWithPopup,
} from "../../firebase/firebase";
import history from "../../history";

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
  const { loading, token, isOnboarded } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = [];

    if (!form.name) {
      errors.push("Name is required");
    }
    if (!form.email) {
      errors.push("Email is required");
    }
    if (!form.password) {
      errors.push("Password is required");
    }
    if (!form.confirmPassword) {
      errors.push("Confirm Password is required");
    }
    if (form.password !== form.confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    dispatch(
      signup(
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        navigate
      )
    );
  };

  // ✅ Handle OAuth signup for Google/Apple
  const handleOAuthSignup = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      dispatch(
        oAuthSignup(
          {
            email: user.email,
            userId: user.uid,
            fullName: user.displayName,
            provider: provider.providerId,
          },
          navigate
        )
      );
    } catch (err) {
      console.error("OAuth signup error:", err);
      setError("Social signup failed. Please try again.");
    }
  };
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h5" gutterBottom data-cy="signup-title">
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
              data-cy="signup-name"
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
              data-cy="signup-email"
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
              data-cy="signup-password"
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
              data-cy="signup-confirm-password"
            />
          </Grid2>
        </Grid2>

        {error && (
          <Typography color="error" variant="body2" data-cy="signup-error">
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: 15 }}
          data-cy="signup-button"
        >
          {loading ? <CircularProgress size={24} /> : "Sign Up"}
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
          <Button color="primary" onClick={() => history.push("/login")}>
            Login
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Signup;
