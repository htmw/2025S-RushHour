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
  Grid2,
  FormControlLabel,
  Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { headerRouteList } from "../routes/routeList";
import { logoutUser, setTheme } from "../store/actions";
import history from "../history";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { styled, width } from "@mui/system";

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
    backgroundColor: theme.palette.background.paper,
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
    backgroundColor: theme.palette.secondary.main,
    opacity: 1,
  },
}));

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const darkMode = useSelector((state) => state.theme.darkMode);

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
  const handleThemeToggle = () => {
    dispatch(setTheme.success({ inDarkMode: !darkMode })); // Toggle theme
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo / App Name */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
          <Grid2 container direction={"row"} alignItems={"center"}>
            <Grid2>
              <ThemeSwitch checked={darkMode} onChange={handleThemeToggle} />
            </Grid2>
            <Grid2>
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
            </Grid2>
          </Grid2>
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
