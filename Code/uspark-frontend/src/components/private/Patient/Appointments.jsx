import React from "react";
import {
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const appointments = [
  {
    id: 1,
    date: "2025-03-30",
    time: "10:00 AM",
    doctor: "Dr. John Doe",
    location: "City Hospital",
  },
  {
    id: 2,
    date: "2025-04-02",
    time: "02:30 PM",
    doctor: "Dr. Sarah Smith",
    location: "Downtown Clinic",
  },
  {
    id: 3,
    date: "2025-04-05",
    time: "11:15 AM",
    doctor: "Dr. Emily White",
    location: "Health Center",
  },
];

const AppointmentsPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Appointments
        </Typography>
        <List>
          {appointments.map((appointment, index) => (
            <React.Fragment key={appointment.id}>
              <ListItem>
                <ListItemText
                  primary={`${appointment.date} at ${appointment.time}`}
                  secondary={`Doctor: ${appointment.doctor} | Location: ${appointment.location}`}
                />
              </ListItem>
              {index < appointments.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default AppointmentsPage;
