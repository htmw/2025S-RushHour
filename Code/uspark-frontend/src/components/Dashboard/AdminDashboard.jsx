import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Paper, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [tab, setTab] = useState(0); // 0 = Pending, 1 = Approved, 2 = Rejected
  const API_URL = "http://localhost:5000/api/admin";

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/doctors`);
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleVerification = async (doctorId, decision) => {
    try {
      await fetch(`${API_URL}/verify-doctor/${doctorId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      fetchDoctors(); // Refresh doctor list
    } catch (error) {
      console.error("Error updating verification:", error);
    }
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
      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Specialization</strong></TableCell>
            <TableCell><strong>Experience</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
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
                    <Button variant="contained" color="primary" onClick={() => handleVerification(doctor._id, "approved")}>Approve</Button>
                    <Button variant="contained" color="error" onClick={() => handleVerification(doctor._id, "rejected")} sx={{ ml: 1 }}>Reject</Button>
                  </>
                )}
                <Button variant="outlined" sx={{ ml: 1 }} onClick={() => setSelectedDoctor(doctor)}>View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <Dialog open={!!selectedDoctor} onClose={() => setSelectedDoctor(null)}>
          <DialogTitle>Doctor Details</DialogTitle>
          <DialogContent>
            <Typography><strong>Name:</strong> {selectedDoctor.userId.fullName}</Typography>
            <Typography><strong>Email:</strong> {selectedDoctor.userId.email}</Typography>
            <Typography><strong>Specialization:</strong> {selectedDoctor.specialization}</Typography>
            <Typography><strong>Experience:</strong> {selectedDoctor.experience} years</Typography>
            <Typography><strong>Documents:</strong></Typography>
            {selectedDoctor.verificationDocs.length > 0 ? (
              selectedDoctor.verificationDocs.map((doc, index) => (
                <a key={index} href={doc} target="_blank" rel="noopener noreferrer">
                  <Typography variant="body2" color="primary">View Document {index + 1}</Typography>
                </a>
              ))
            ) : (
              <Typography>No documents uploaded.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedDoctor(null)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default AdminDashboard;
