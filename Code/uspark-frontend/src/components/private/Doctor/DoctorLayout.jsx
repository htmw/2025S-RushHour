/**
 * @file Doctor dashboard layout component.
 *
 * Provides a layout with a sidebar, navigation, and header for doctor-specific pages.
 *
 * @namespace src.components.private.Doctor.DoctorLayout
 * @memberof src.components.private.Doctor
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
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../store/actions";

/**
 * Sidebar width constant.
 *
 * @constant {number}
 */
const drawerWidth = 240;

/**
 * DoctorLayout Component
 *
 * Provides a responsive layout with a sidebar for doctor-related pages.
 * Includes navigation to the dashboard, profile, about page, and a logout option.
 *
 * @component
 * @memberof src.components.private.Doctor.DoctorLayout
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render inside the layout.
 * @returns {JSX.Element} The doctor dashboard layout.
 */
const DoctorLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Sidebar open state.
   *
   * @property {boolean}
   */
  const [open, setOpen] = useState(false);

  /**
   * Toggles the sidebar drawer.
   *
   * @function
   * @memberof src.components.private.Doctor.DoctorLayout
   */
  const toggleDrawer = () => {
    setOpen(!open);
  };

  /**
   * Handles user logout by dispatching the `logoutUser` action.
   *
   * @function
   * @memberof src.components.private.Doctor.DoctorLayout
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
            Doctor Dashboard
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
            onClick={() => navigate("/docprofile")}
            sx={{ cursor: "pointer" }}
          >
            <ListItemIcon sx={{ cursor: "pointer" }}>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>

          <ListItem
            button
            onClick={() => navigate("/daboutus")}
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

export default DoctorLayout;
