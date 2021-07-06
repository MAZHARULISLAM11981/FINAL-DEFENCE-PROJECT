import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link, useHistory } from "react-router-dom";
import { deepPurple } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Notification from "../components/Notification";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://images.unsplash.com/photo-1526925539332-aa3b66e35444?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=701&q=80)",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.type === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: deepPurple[700],
    "&:hover": {
      backgroundColor: deepPurple[900],
    },
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();

  // STATES
  const [loading, setLoading] = useState(false);
  const [signInInfo, setSignInInfo] = useState({
    email: "",
    password: "",
  });
  const { email, password } = signInInfo;

  // METHODS
  const handleValidation = () => {
    const validEmail = /.+@.+\..+/.test(email);
    if (email === "" || password === "") {
      return Notification("Warning", "All fields required", "warning");
    } else if (!validEmail) {
      return Notification("Warning", "Email is not valid", "warning");
    } else {
      return true;
    }
  };
  const handleChange = (e) => setSignInInfo({ ...signInInfo, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (handleValidation()) {
      axios
        .post("/auth/signin", { email: email, password: password })
        .then((res) => {
          if (res.data.status === "ok") {
            localStorage.setItem("name", res.data.data.fullName);
            localStorage.setItem("email", res.data.data.email);
            localStorage.setItem("role", res.data.data.role);
            localStorage.setItem("token", res.data.data.token);
            if (res.data.data.role === "user") {
              history.push("/mails");
            } else {
              history.push("/user-list");
            }
            window.location.reload();
          } else {
            Notification("Error", `${res.data.message}`, "error");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" value={email} onChange={handleChange} autoComplete="email" autoFocus />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={handleChange}
              id="password"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} disabled={loading}>
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
              <Grid item>
                <Link to="forgot-password" variant="body2">
                  Forgot Password
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
