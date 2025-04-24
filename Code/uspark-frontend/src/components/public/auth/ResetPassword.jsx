/**
 * @file ResetPassword Component
 * @namespace src.components.public.auth.ResetPassword
 * @memberof src.components.public.auth
 *
 * This component allows users to reset their password using a token-based link.
 * Features include:
 * - Token validation via route params
 * - Form input for new password and confirm password
 * - Error and success feedback
 * - Dispatch to backend to complete password reset
 */

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Paper,
} from "@mui/material";
import { resetPasswordApi } from "../../../store/apis";
import { enqueueSnackbar } from "notistack";

/**
 * ResetPassword Component
 *
 * @memberof src.components.public.auth.ResetPassword
 * @returns {JSX.Element} - A form allowing the user to reset their password using a valid token.
 *
 * @example
 * <ResetPassword />
 */

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPasswordApi(email, token, newPassword);

      setSuccess(true);
      enqueueSnackbar("Password reset successful!", { variant: "success" });
      setTimeout(() => navigate("/login"), 3000); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      enqueueSnackbar(err.response?.data?.message || "Something went wrong", {
        variant: "error",
      });
      setTimeout(() => navigate("/forgot-password"), 2000); // Navigate to forgot-password on failure
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Reset Password
        </Typography>

        {success ? (
          <Alert severity="success">
            Password reset successful! Redirecting to login...
          </Alert>
        ) : (
          <form onSubmit={handleResetPassword}>
            {error && <Alert severity="error">{error}</Alert>}

            <Box sx={{ mt: 2 }}>
              <TextField
                data-cy="resetPassword-new"
                label="New Password"
                type="password"
                fullWidth
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="outlined"
                margin="normal"
              />
              <TextField
                label="Confirm Password"
                data-cy="resetPassword-confirm"
                type="password"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                margin="normal"
              />
            </Box>

            <Button
              data-cy="resetPassword-submit"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Reset Password
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPassword;
