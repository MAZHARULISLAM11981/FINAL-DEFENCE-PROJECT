import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Hidden, IconButton, Menu, MenuItem, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import PeopleIcon from "@material-ui/icons/People";
import TextsmsIcon from "@material-ui/icons/Textsms";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SecurityIcon from "@material-ui/icons/Security";
import { purple } from "@material-ui/core/colors";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  buttonStyle: {
    textTransform: "capitalize",
    color: purple[500],
  },
}));
const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

function HeaderComponent() {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationEl, setNotificationEl] = useState(null);

  const [alert, setAlert] = useState({ email: 0, message: 0, totalCount: 0 });
  const { email, message, totalCount } = alert;

  useEffect(() => {
    axios
      .get(`/alert/${localStorage.getItem("email")}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
        setAlert({ email: res.data.data.email, message: res.data.data.message, totalCount: res.data.data.email + res.data.data.message });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleNotificationClick = (event) => {
    console.log("clicked");
    setNotificationEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    setLoading(true);
    axios
      .post("/auth/logout", { token: localStorage.getItem("token"), email: localStorage.getItem("email") })
      .then((res) => {
        if (res.data.status === "ok") {
          localStorage.clear();
          history.push("/login");
          window.location.reload();
        } else {
          Notification("Error", "Something went wrong. Please check your internet connection", "error");
        }
      })
      .finally(() => setLoading(false));
  };
  return (
    <div>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Hidden lgUp>
            <IconButton aria-controls="simple-menu" aria-haspopup="true" edge="start" className={classes.menuButton} onClick={handleClick} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>

            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
              {localStorage.getItem("token") && localStorage.getItem("role") === "user" ? (
                <>
                  <Link to="/mails">
                    <MenuItem onClick={handleClose}>Mail</MenuItem>
                  </Link>
                  <Link to="/secure-file">
                    <MenuItem onClick={handleClose}>Encryption / Decryption</MenuItem>
                  </Link>
                  <Link to="/live-chat">
                    <MenuItem onClick={handleClose}>Live Chat</MenuItem>
                  </Link>
                  <Link to="/notification-list">
                    <MenuItem onClick={handleClose}>Admin Alert</MenuItem>
                  </Link>

                  <MenuItem onClick={logout} className={classes.buttonStyle}>
                    Logout
                  </MenuItem>
                </>
              ) : localStorage.getItem("token") && localStorage.getItem("role") === "admin" ? (
                <>
                  <Link to="/user-list">
                    <MenuItem onClick={handleClose}>Registered Users</MenuItem>
                  </Link>
                  <Link to="/create-notification">
                    <MenuItem onClick={handleClose}>Create Notification</MenuItem>
                  </Link>
                  <Link to="/notification-list">
                    <MenuItem onClick={handleClose}>Notification List</MenuItem>
                  </Link>
                  <MenuItem onClick={logout} className={classes.buttonStyle}>
                    Logout
                  </MenuItem>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <MenuItem onClick={handleClose}>Login</MenuItem>
                  </Link>
                  <Link to="/register">
                    <MenuItem onClick={handleClose}>Register</MenuItem>
                  </Link>
                </>
              )}
            </Menu>
          </Hidden>

          <Typography variant="h6" className={classes.title}>
            Secure Mail Box
          </Typography>

          <Hidden mdDown>
            {localStorage.getItem("token") && localStorage.getItem("role") === "user" ? (
              <>
                <Box px={1}>
                  <Link to="/mails">
                    <Button color="inherit" startIcon={<MailIcon />} className={classes.buttonStyle}>
                      Mail
                    </Button>
                  </Link>
                </Box>

                <Box px={1}>
                  <Link to="/live-chat">
                    <Button color="inherit" startIcon={<TextsmsIcon />} className={classes.buttonStyle}>
                      Live Chat
                    </Button>
                  </Link>
                </Box>

                <Box px={1}>
                  <Link to="/secure-file">
                    <Button color="inherit" startIcon={<SecurityIcon />} className={classes.buttonStyle}>
                      Encryption/ Decryption
                    </Button>
                  </Link>
                </Box>

                <Box px={1}>
                  <Link to="/notification-list">
                    <Button color="inherit" startIcon={<AccountCircleIcon />} className={classes.buttonStyle}>
                      Admin Alert
                    </Button>
                  </Link>
                </Box>

                <Box px={1}>
                  <IconButton color="primary" aria-label="notification" aria-controls="long-menu" aria-haspopup="true" onClick={handleNotificationClick}>
                    <StyledBadge badgeContent={totalCount} color="secondary">
                      <NotificationsIcon />
                    </StyledBadge>
                  </IconButton>
                  <Menu id="long-menu" anchorEl={notificationEl} keepMounted open={Boolean(notificationEl)} onClose={handleNotificationClose}>
                    <MenuItem onClick={handleNotificationClose}> You have {email} new mail to read </MenuItem>
                    <MenuItem onClick={handleNotificationClose}> You have {message} new messages </MenuItem>
                  </Menu>
                </Box>

                <Box px={1}>
                  <Button color="inherit" className={classes.buttonStyle} onClick={logout} disabled={loading}>
                    Logout as {localStorage.getItem("name")}
                  </Button>
                </Box>
              </>
            ) : localStorage.getItem("token") && localStorage.getItem("role") === "admin" ? (
              <>
                <Box px={1}>
                  <Link to="/user-list">
                    <Button color="inherit" startIcon={<PeopleIcon />} className={classes.buttonStyle}>
                      User List
                    </Button>
                  </Link>
                </Box>

                <Box px={1}>
                  <Link to="/create-notification">
                    <Button color="inherit" startIcon={<AddAlertIcon />} className={classes.buttonStyle}>
                      Create Notification
                    </Button>
                  </Link>
                </Box>

                <Box px={1}>
                  <Link to="/notification-list">
                    <Button color="inherit" startIcon={<NotificationsIcon />} className={classes.buttonStyle}>
                      Notifications
                    </Button>
                  </Link>
                </Box>

                <Box px={1}>
                  <Button color="inherit" className={classes.buttonStyle} onClick={logout} disabled={loading}>
                    Logout as {localStorage.getItem("name")}
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Box px={1}>
                  <Link to="/login">
                    <Button color="inherit" className={classes.buttonStyle}>
                      Login
                    </Button>
                  </Link>
                </Box>

                <Box px={1}>
                  <Link to="/register">
                    <Button color="inherit" className={classes.buttonStyle}>
                      Register
                    </Button>
                  </Link>
                </Box>
              </>
            )}
          </Hidden>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default HeaderComponent;
