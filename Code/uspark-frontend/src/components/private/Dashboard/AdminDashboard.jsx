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
} from "@mui/material";
import { fetchDoctors, verifyDoctor } from "../../../store/actions";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { doctors, loading } = useSelector((state) => state.admin);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [tab, setTab] = useState(0); // 0 = Pending, 1 = Approved, 2 = Rejected

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const handleVerification = (doctorId, decision) => {
    dispatch(verifyDoctor({ doctorId, decision }));
  };

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

      {/* Tabs for filtering doctors */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} centered>
          <Tab label="Pending Approval" />
          <Tab label="Approved Doctors" />
          <Tab label="Rejected Doctors" />
        </Tabs>
      </Paper>

      {/* Doctor Table */}
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
                <TableCell>{doctor.userId.fullName}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.experience} years</TableCell>
                <TableCell>
                  {tab === 0 && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleVerification(doctor._id, "approved")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          handleVerification(doctor._id, "rejected")
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

      {/* Doctor Details Modal */}
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
