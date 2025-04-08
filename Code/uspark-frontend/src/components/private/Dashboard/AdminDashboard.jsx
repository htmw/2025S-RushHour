/**
 * @file AdminDashboard Component
 * @namespace src.components.private.Dashboard.AdminDashboard
 * @memberof src.components.private.Dashboard
 *
 * This component provides the admin interface for managing and verifying doctors.
 * It includes functionality for:
 * - Setting and validating an admin access code
 * - Viewing lists of doctors by verification status (Pending, Approved, Rejected)
 * - Approving or rejecting doctors
 * - Viewing detailed information in a dialog
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { adminDoctor, verifyDoctor } from "../../../store/actions";


/**
 * AdminDashboard Component
 *
 * @memberof src.components.private.Dashboard.AdminDashboard
 *
 * @returns {JSX.Element} - The admin dashboard interface for verifying doctors.
 *
 * @example
 * <AdminDashboard />
 */

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((state) => state.admin);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [tab, setTab] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [isSettingCode, setIsSettingCode] = useState(false);

  useEffect(() => {
    // Check if an admin code exists
    if (!localStorage.getItem("adminCode")) {
      setIsSettingCode(true); // Prompt to set a new code
    }
  }, []);

  useEffect(() => {
    // if (accessGranted) {
      dispatch(adminDoctor());
    // }
  }, [dispatch, accessGranted]);

  const handleSetCode = () => {
    if (newCode.trim().length < 4) {
      alert("Code must be at least 4 characters long.");
      return;
    }
    localStorage.setItem("adminCode", newCode);
    setIsSettingCode(false);
    alert("Admin access code set successfully!");
  };

  const handleAccessCodeSubmit = () => {
    const storedCode = localStorage.getItem("adminCode");
    if (enteredCode === storedCode) {
      setAccessGranted(true);
    } else {
      alert("Incorrect code. Please try again.");
    }
  };

  if (isSettingCode) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Set Admin Access Code
        </Typography>
        <TextField
          label="Set Access Code"
          type="password"
          variant="outlined"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          sx={{ mt: 2, mb: 2, width: "250px" }}
        />
        <Box>
          <Button variant="contained" onClick={handleSetCode}>
            Save Code
          </Button>
        </Box>
      </Container>
    );
  }

  if (!accessGranted) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Admin Access Required
        </Typography>
        <TextField
          label="Enter Access Code"
          type="password"
          variant="outlined"
          value={enteredCode}
          onChange={(e) => setEnteredCode(e.target.value)}
          sx={{ mt: 2, mb: 2, width: "250px" }}
        />
        <Box>
          <Button variant="contained" onClick={handleAccessCodeSubmit}>
            Submit
          </Button>
        </Box>
      </Container>
    );
  }

  const filteredDoctors = doctors.filter((doc) => {
    if (tab === 0) return doc.verificationStatus === "pending";
    if (tab === 1) return doc.verificationStatus === "approved";
    if (tab === 2) return doc.verificationStatus === "rejected";
    return true;
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - Doctor Verification
      </Typography>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} centered>
          <Tab label="Pending Approval" />
          <Tab label="Approved Doctors" />
          <Tab label="Rejected Doctors" />
        </Tabs>
      </Paper>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Specialization</strong>
              </TableCell>
              <TableCell>
                <strong>Experience</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow key={doctor._id}>
                <TableCell>{doctor.userId?.fullName}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.experience} years</TableCell>
                <TableCell>
                  {tab === 0 && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          dispatch(
                            verifyDoctor({
                              doctorId: doctor._id,
                              decision: "approved",
                            })
                          )
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          dispatch(
                            verifyDoctor({
                              doctorId: doctor._id,
                              decision: "rejected",
                            })
                          )
                        }
                        sx={{ ml: 1 }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedDoctor && (
        <Dialog open={!!selectedDoctor} onClose={() => setSelectedDoctor(null)}>
          <DialogTitle>Doctor Details</DialogTitle>
          <DialogContent>
            <Typography>
              <strong>Name:</strong> {selectedDoctor.userId.fullName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {selectedDoctor.userId.email}
            </Typography>
            <Typography>
              <strong>Specialization:</strong> {selectedDoctor.specialization}
            </Typography>
            <Typography>
              <strong>Experience:</strong> {selectedDoctor.experience} years
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedDoctor(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default AdminDashboard;
