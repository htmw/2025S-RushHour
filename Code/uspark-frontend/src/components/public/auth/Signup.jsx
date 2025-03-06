/**
 * @fileoverview Signup component for Uspark.
 * Allows users to register using email/password or OAuth providers (Google, Apple).
 * Uses Firebase authentication and Redux for state management.
 */

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
  CircularProgress,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import { useDispatch, useSelector } from "react-redux";
import { oAuthSignup, signup } from "../../../store/actions";

// ✅ Firebase Auth Imports
import {
  auth,
  googleProvider,
  appleProvider,
  signInWithPopup,
} from "../../../firebase/firebase";
import history from "../../../history";

/**
 * Signup Component
 *
 * Handles user registration via email/password and OAuth providers (Google, Apple).
 *
 * @component
 * @returns {JSX.Element} The signup form and authentication buttons.
 */
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Local state for signup form fields.
   * @type {[{ name: string, email: string, password: string, confirmPassword: string }, Function]}
   */
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /**
   * Local state for storing error messages.
   * @type {[string, Function]}
   */
  const [error, setError] = useState("");

  /**
   * Authentication state from Redux.
   * @type {Object}
   * @property {boolean} loading - Indicates if signup is in progress.
   * @property {string|null} token - Authentication token if signup is successful.
   * @property {boolean} isOnboarded - Indicates if the user has completed onboarding.
   */
  const { loading, token, isOnboarded } = useSelector((state) => state.auth);

  /**
   * Handles input field changes and updates local form state.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Validates and submits the signup form using Redux dispatch.
   * @param {React.FormEvent} e - Form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = [];

    if (!form.name) errors.push("Name is required");
    if (!form.email) errors.push("Email is required");
    if (!form.password) errors.push("Password is required");
    if (!form.confirmPassword) errors.push("Confirm Password is required");
    if (form.password !== form.confirmPassword)
      errors.push("Passwords do not match");

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

  /**
   * Handles OAuth signup via Firebase popup authentication.
   * @param {import("firebase/auth").AuthProvider} provider - Firebase authentication provider (Google/Apple).
   */
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
          <Grid2 item size={{ xs: 12 }}>
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
          <Grid2 item size={{ xs: 12 }}>
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
          <Grid2 item size={{ xs: 12 }}>
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
          <Grid2 item size={{ xs: 12 }}>
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

        {/* ✅ Google Signup Button */}
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

        {/* ✅ Apple Signup Button */}
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
