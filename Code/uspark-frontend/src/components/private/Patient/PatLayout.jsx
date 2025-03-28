/**
 * @file PatientLayout Component
 *
 *
 * @namespace src.components.private.Patient.PatLayout
 * @memberof src.components.private.Patient
 *
 * This component provides a layout for the patient dashboard, including:
 * - A top navigation bar with a menu button.
 * - A collapsible sidebar with navigation options.
 * - A logout button to handle user sign-out.
 * - A main content area for rendering child components.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  Person,
  Info,
  ExitToApp,
  Event,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../store/actions";

const drawerWidth = 240;

/**
 *
 * @component
 * @memberof src.components.private.Patient.PatLayout
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The child components to render inside the layout.
 * @returns {JSX.Element} - The PatientLayout component with sidebar navigation.
 *
 * @example
 * <PatientLayout>
 *   <Dashboard />
 * </PatientLayout>
 */
const PatientLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * State for managing sidebar visibility.
   * @property {boolean} open - Sidebar open state and setter function.
   */
  const [open, setOpen] = useState(false);

  /**
   * Toggles the sidebar drawer open/closed.
   */
  const toggleDrawer = () => {
    setOpen(!open);
  };

  /**
   * Handles user logout by dispatching the logout action.
   */
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* HEADER WITH MENU ICON */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, cursor: "pointer" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Patient Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR DRAWER (Collapsible) */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          <ListItem
            button
            onClick={() => navigate("/dashboard")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon sx={{ cursor: "pointer" }}>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem
            button
            onClick={() => navigate("/patprofile")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon sx={{ cursor: "pointer" }}>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>

          <ListItem
            button
            onClick={() => navigate("/appointments")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon sx={{ cursor: "pointer" }}>
              <Event />
            </ListItemIcon>
            <ListItemText primary="Appointments" />
          </ListItem>

          <ListItem
            button
            onClick={() => navigate("/aboutus")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon sx={{ cursor: "pointer" }}>
              <Info />
            </ListItemIcon>
            <ListItemText primary="About Us" />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Logout Button */}
        <ListItem button onClick={handleLogout} sx={{ cursor: "pointer" }}>
          <ListItemIcon sx={{ cursor: "pointer" }}>
            <ExitToApp color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: "error.main" }} />
        </ListItem>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Adjust margin so content is not hidden under the header
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PatientLayout;
