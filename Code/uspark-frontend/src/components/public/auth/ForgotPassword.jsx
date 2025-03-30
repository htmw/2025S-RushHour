import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../../store/actions";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { error, loading, message } = useSelector(
    (state) => state.forgotPassword
  );
  const [showMessage, setShowMessage] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let timer;
    if (!loading && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) clearInterval(timer);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
    setCountdown(30); // start 30s countdown after dispatch
    setShowMessage(true);
  };

  const renderButtonContent = () => {
    if (countdown > 0) {
      const progressValue = ((30 - countdown) / 30) * 100;

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={20}
            thickness={5}
            variant="determinate"
            value={progressValue}
            style={{ marginRight: 8 }}
          />
          {`Wait ${countdown}s`}
        </div>
      );
    }
    if (loading) return "Sending...";
    return "Send Reset Link";
  };

  useEffect(() => {
    let timer;
    if (!loading && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setShowMessage(false); // ✅ Hide the message when countdown ends
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, loading]);

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
          {message && showMessage && !loading && !error && (
            <Typography
              variant="body2"
              style={{
                color: "#2e7d32",
                backgroundColor: "#e8f5e9",
                padding: "6px 10px",
                marginTop: 10,
                borderRadius: 4,
              }}
            >
              {message}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: 15 }}
            disabled={loading || countdown > 0}
          >
            {renderButtonContent()}
          </Button>
        </form>

        {error && (
          <Typography color="error" variant="body2" style={{ marginTop: 15 }}>
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
