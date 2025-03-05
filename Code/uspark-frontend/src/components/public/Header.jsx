// src/components/Header.jsx
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

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: theme.palette.primary.main, // Blue text color
  position: "relative",
  display: "inline-block",
}));

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const darkMode = useSelector((state) => state.theme.darkMode);

  // User authentication state from Redux
  const user = useSelector((state) => state.auth?.email); // Adjust based on your store

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser(navigate));
    handleMenuClose();
  };
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
              <Grid2 item>
                <Link
                  component={RouterLink}
                  key={path}
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
                      <MenuItem component={Link} to="/profile">
                        Profile
                      </MenuItem>
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
                <MenuItem key={path} component={Link} to={path}>
                  {name}
                </MenuItem>
              ))}
              {user ? (
                <>
                  <MenuItem component={Link} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem component={Link} to="/login">
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
