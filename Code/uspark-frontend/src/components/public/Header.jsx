/**
 * @file Header component with navigation, authentication controls,
 * and theme switching. Supports both desktop and mobile views.
 *
 * @namespace src.components.public.Header
 * @memberof src.components.public
 */

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu, 
  MenuItem,
  Avatar,
  useMediaQuery,
  Grid2,
  Button,
  Link,
  Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { headerRouteList } from "../../routes/routeList";
import { logoutUser, setTheme } from "../../store/actions";
import { Link as RouterLink } from "react-router-dom";
import { styled } from "@mui/system";

/**
 * Custom styled theme switch component for toggling between light and dark mode.
 */
const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      transform: "translateX(28px)",
      "& .MuiSwitch-thumb:before": {
        content: '"🌛"',
        fontSize: "16px",
      },
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.background.default,
    width: 23,
    height: 23,
    marginTop: "4.5px",
    "&:before": {
      content: '"🔆"', // Sun emoji for light mode
      fontSize: "16px",
    },
  },
  "& .MuiSwitch-track": {
    width: "43px",
    borderRadius: 34 / 2,
    backgroundColor: theme.palette.primary.main,
    opacity: 1,
  },
}));

/**
 * Custom styled logo text component.
 */
const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: theme.palette.primary.main, // Blue text color
  position: "relative",
  display: "inline-block",
}));

/**
 * Header Component
 *
 * Displays the navigation bar with links, theme switcher, and authentication options.
 *
 * @component
 * @memberof src.components.public
 * @returns {JSX.Element} The header component with navigation and user authentication controls.
 */
const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const darkMode = useSelector((state) => state.theme.darkMode);

  /**
   * Retrieves the authenticated user's email from Redux state.
   * @type {string|null}
   */
  const user = useSelector((state) => state.auth?.email); // Adjust based on your store

  /** @type {HTMLElement} */
  const [anchorEl, setAnchorEl] = React.useState(null);

  /**
   * Opens the user menu.
   * @param {React.MouseEvent} event - The event triggering the menu open.
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the user menu.
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Logs the user out and navigates to the login page.
   */
  const handleLogout = () => {
    dispatch(logoutUser(navigate));
    handleMenuClose();
  };

  /**
   * Toggles between light and dark themes.
   */
  const handleThemeToggle = () => {
    dispatch(setTheme.success({ inDarkMode: !darkMode })); // Toggle theme
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link
            component={RouterLink}
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <LogoText>Uspark</LogoText>
          </Link>
        </Typography>

        {!isMobile ? (
          <Grid2 container alignItems="center" spacing={2}>
            {headerRouteList.map(({ name, path }) => (
              <Grid2 item key={path}>
                <Link
                  component={RouterLink}
                  to={path}
                  sx={{
                    textDecoration: "none",
                    color:
                      location.pathname === path ? "primary.main" : "inherit",
                    fontWeight: "bold",
                    marginLeft: "15px",
                    cursor: location.pathname === path ? "default" : "pointer",
                    "&:hover": {
                      color:
                        location.pathname === path
                          ? "primary.main"
                          : "secondary.main",
                    },
                  }}
                >
                  {name}
                </Link>
              </Grid2>
            ))}
            <Grid2 item>
              <ThemeSwitch checked={darkMode} onChange={handleThemeToggle} />
            </Grid2>
            <Grid2 item>
              {user ? (
                <Grid2 container direction="row" alignItems="center">
                  <Grid2>
                    <IconButton onClick={handleMenuOpen} color="inherit">
                      <Avatar alt={user.fullName} src={user.avatarUrl || ""} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </Grid2>
                </Grid2>
              ) : (
                <Grid2 container alignItems="center" spacing={2}>
                  <Grid2 item>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      Log In
                    </Button>
                  </Grid2>
                  <Grid2 item>
                    <Button
                      component={RouterLink}
                      to="/signup"
                      variant="contained"
                      color="primary"
                      sx={{ borderRadius: 2 }}
                    >
                      Start Free Trial
                    </Button>
                  </Grid2>
                </Grid2>
              )}
            </Grid2>
          </Grid2>
        ) : (
          <>
            <IconButton onClick={handleMenuOpen} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {headerRouteList.map(({ name, path }) => (
                <MenuItem key={path} component={RouterLink} to={path}>
                  {name}
                </MenuItem>
              ))}
              {user ? (
                <>
                  <MenuItem component={RouterLink} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem component={RouterLink} to="/login">
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
