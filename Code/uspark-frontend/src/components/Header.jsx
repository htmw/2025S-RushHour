// src/components/Header.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice"; // Assume you have a logout action
import { headerRouteList } from "../routes/routeList";
const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // User authentication state from Redux
  const user = useSelector((state) => state.auth); // Adjust based on your store

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo / App Name */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Uspark
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            {headerRouteList.map(({ name, path }) => {
              return (
                <Button color="inherit" onClick={() => navigate(path)}>
                  {name}
                </Button>
              );
            })}
          </>
        )}

        {/* User Profile or Login */}
        {user ? (
          <>
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar alt={user.fullName} src={user.avatarUrl || ""} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <>
            <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {headerRouteList.map(({ name, path }) => {
                return (
                  <MenuItem onClick={() => navigate(path)}>{name}</MenuItem>
                );
              })}

              {user ? (
                <>
                  <MenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>
              )}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
