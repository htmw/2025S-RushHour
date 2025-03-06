/**
 * @fileoverview Login component for Uspark.
 * Allows users to log in using email/password or OAuth providers (Google, Apple).
 * Uses Firebase authentication and Redux for state management.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid2,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";

import {
  auth,
  googleProvider,
  appleProvider,
  signInWithPopup,
} from "../../../firebase/firebase";
import { login, oAuthLogin } from "../../../store/actions";
import history from "../../../history";

/**
 * Login Component
 *
 * Handles user authentication via email/password and OAuth providers (Google, Apple).
 *
 * @component
 * @returns {JSX.Element} The login form and authentication buttons.
 */
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Local state for login form fields.
   * @type {[{ email: string, password: string }, Function]}
   */
  const [form, setForm] = useState({ email: "", password: "" });

  /**
   * Authentication state from Redux.
   * @type {Object}
   * @property {boolean} loading - Indicates if login is in progress.
   * @property {string|null} error - Holds error messages if login fails.
   * @property {string|null} token - Authentication token if login is successful.
   * @property {boolean} isOnboarded - Indicates if the user has completed onboarding.
   */
  const { loading, error, token, isOnboarded } = useSelector(
    (state) => state.auth
  );

  /**
   * Handles input field changes and updates local form state.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Submits the login form using Redux dispatch.
   * @param {React.FormEvent} e - Form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(form, navigate));
  };

  /**
   * Handles OAuth login via Firebase popup authentication.
   * @param {import("firebase/auth").AuthProvider} provider - Firebase authentication provider (Google/Apple).
   */
  const handleOAuthLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      dispatch(
        oAuthLogin(
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
      console.error("OAuth login error:", err);
    }
  };

  /**
   * Redirects authenticated users to the dashboard or onboarding page.
   */
  useEffect(() => {
    if (token) {
      history.push(isOnboarded ? "/dashboard" : "/");
    }
  }, [token, isOnboarded, navigate]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h5" gutterBottom data-cy="login-title">
          Login to Your Account
        </Typography>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              data-cy="login-email"
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
              data-cy="login-password"
            />
          </Grid2>
        </Grid2>

        {error && (
          <Typography color="error" variant="body2" data-cy="login-error">
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: 15 }}
          data-cy="login-button"
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>

        <Divider style={{ margin: "20px 0" }}>OR</Divider>

        <Button
          fullWidth
          variant="outlined"
          color="primary"
          startIcon={<GoogleIcon />}
          style={{ marginBottom: 10 }}
          onClick={() => handleOAuthLogin(googleProvider)}
          data-cy="login-google"
        >
          Sign in with Google
        </Button>

        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          startIcon={<AppleIcon />}
          onClick={() => handleOAuthLogin(appleProvider)}
          data-cy="login-apple"
        >
          Sign in with Apple
        </Button>

        <Typography variant="body2" align="center" style={{ marginTop: 10 }}>
          Don't have an account?{" "}
          <Button color="primary" onClick={() => history.push("/signup")}>
            Sign Up
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
