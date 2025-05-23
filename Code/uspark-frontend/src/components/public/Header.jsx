/**
 * @file Header component with navigation, authentication controls,
 * and theme switching. Supports both desktop and mobile views.
 *
 * @namespace src.components.public.Header
 * @memberof src.components.public
 */

import React, { useEffect } from "react";
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
import {
  publicHeaderRouteList,
  patientRouteList,
  doctorRouteList,
} from "../../routes/routeList";
import { logoutUser, setTheme } from "../../store/actions";
import { Link as RouterLink } from "react-router-dom";
import { styled } from "@mui/system";
import NotificationsIcon from "@mui/icons-material/Notifications";

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
  const role = useSelector(
    (state) =>
      state.profile?.userData?.role || state.dashboard?.userData?.role || null
  );
  const imageUrl = useSelector((state) => state.profile?.imageUrl || null);

  const [routeList, setRouteList] = React.useState(publicHeaderRouteList);

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

  useEffect(() => {
    const routeList =
      role === "patient"
        ? patientRouteList
        : role === "doctor"
        ? doctorRouteList
        : publicHeaderRouteList;
    setRouteList(routeList);
  }, [role]);

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
            {routeList.map(({ name, path }) => (
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
                  data-cy={`header-${name}`}
                >
                  {name}
                </Link>
              </Grid2>
            ))}
            {user && (
              <Grid2 item>
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Grid2>
            )}
            <Grid2 item>
              <ThemeSwitch checked={darkMode} onChange={handleThemeToggle} />
            </Grid2>
            {user && (
              <Grid2 item>
                <IconButton onClick={handleMenuOpen} color="inherit">
                  <Avatar
                    alt={user.fullName || user}
                    src={imageUrl}
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: "primary.main",
                      fontSize: 14,
                    }}
                  >
                    {!imageUrl && (user.fullName?.charAt(0) || user.charAt(0))}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Grid2>
            )}
            {!user && (
              <Grid2 item>
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
              </Grid2>
            )}
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
              {routeList.map(({ name, path }) => (
                <MenuItem
                  key={path}
                  component={RouterLink}
                  to={path}
                  onClick={handleMenuClose}
                  data-cy={`header-${name}`}
                >
                  {name}
                </MenuItem>
              ))}
              {user && (
                <>
                  <MenuItem disabled>
                    <NotificationsIcon /> &nbsp; Notifications
                  </MenuItem>
                  <MenuItem>
                    <ThemeSwitch
                      checked={darkMode}
                      onChange={handleThemeToggle}
                      sx={{ ml: 1 }}
                    />
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              )}
              {!user && (
                <>
                  <MenuItem
                    component={RouterLink}
                    to="/login"
                    onClick={handleMenuClose}
                  >
                    Login
                  </MenuItem>
                  <MenuItem
                    component={RouterLink}
                    to="/signup"
                    onClick={handleMenuClose}
                  >
                    Sign Up
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
