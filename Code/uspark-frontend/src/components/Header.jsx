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
import { headerRouteList } from "../routes/routeList";
import { logoutUser } from "../store/actions";
import history from "../history";
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
    dispatch(logoutUser(navigate));
    history.push("/login");
    handleMenuClose();
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo / App Name */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1}}
          
        >
          Uspark
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            {headerRouteList.map(({ name, path }) => {
              return (
                <Button color="inherit" onClick={() => history.push(path)}>
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
              <MenuItem onClick={() => history.push("/profile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" onClick={() => history.push("/login")}>
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
                  <MenuItem onClick={() => history.push(path)}>{name}</MenuItem>
                );
              })}

              {user ? (
                <>
                  <MenuItem onClick={() => history.push("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => history.push("/login")}>
                  Login
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
