import React, { useState } from "react";
import { Container, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../../store/actions";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { error, loading } = useSelector((state) => state.forgotPassword);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body2">
          Enter your email to receive a password reset link.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginTop: 15 }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: 15 }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        {error && (
          <Typography color="primary" variant="body2" style={{ marginTop: 15 }}>
            {error}
          </Typography>
        )}
        <Button
          fullWidth
          variant="text"
          color="secondary"
          onClick={() => navigate("/login")}
          style={{ marginTop: 10 }}
        >
          Back to Login
        </Button>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
