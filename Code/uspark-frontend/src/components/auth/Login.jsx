// src/components/Login.jsx
import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";

// ✅ Firebase Auth Imports
import {
  auth,
  googleProvider,
  appleProvider,
  signInWithPopup,
} from "../../firebase/firebase";
import { login, oAuthLogin } from "../../store/actions";
import history from "../../history";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const { loading, error, token } = useSelector((state) => state.auth);
  const isOnboarded = useSelector((state) => state.auth.isOnboarded);

  // ✅ Handle Email/Password Login
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(form, navigate));
  };

  // ✅ Handle Google/Apple OAuth Login
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
  useEffect(() => {
    if (token) {
      history.push(isOnboarded ? "/dashboard" : "/");
    }
  }, [token, isOnboarded, navigate]);

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
          {loading ? <CircularProgress size={24} /> : "Login"}
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
          data-cy="signInWithApple"
          variant="outlined"
          color="secondary"
          startIcon={<AppleIcon />}
          onClick={() => handleOAuthLogin(appleProvider)}
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
