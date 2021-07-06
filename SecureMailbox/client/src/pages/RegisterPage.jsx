import React, { useState } from "react";
import { Avatar, Grid, Typography, Container, CssBaseline, TextField, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { deepPurple } from "@material-ui/core/colors";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Notification from "../components/Notification";
import { questionList } from "../utils/constants";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: deepPurple[800],
    "&:hover": {
      backgroundColor: deepPurple[900],
    },
  },

  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function RegisterPage() {
  const classes = useStyles();
  const history = useHistory();

  // STATES
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    answer: "",
  });
  const { name, email, password, confirmPassword, answer } = signUpForm;

  // METHODS
  const handleValidation = () => {
    const validEmail = /.+@.+\..+/.test(email);

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
      return Notification("Warning", "All fields are required", "warning");
    } else if (password !== confirmPassword) {
      return Notification("Warning", "Password didn't match!", "warning");
    } else if (!validEmail) {
      return Notification("Warning", "Invalid email!", "warning");
    } else {
      return true;
    }
  };
  const handleChange = (e) => {
    setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (handleValidation()) {
      const information = {
        fullName: name,
        email: email,
        password: password,
        answer: answer,
        role: "user",
      };
      console.log(information);
      axios
        .post("/auth/signup", information)
        .then((res) => {
          if (res.data.status === "ok") {
            Notification("Congratulations", "Your account is created successfully", "success");
            history.push("/login");
          } else {
            Notification("Error", `${res.data.message}`, "error");
          }
        })
        .finally(() => {
          setLoading(false);
          setSignUpForm({ name: "", email: "", password: "", confirmPassword: "", answer: "" });
        });
    } else {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField autoFocus name="name" value={name} onChange={handleChange} variant="outlined" required fullWidth label="First Name" />
            </Grid>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth label="Email Address" name="email" value={email} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth name="password" value={password} onChange={handleChange} label="Password" type="password" />
            </Grid>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth name="confirmPassword" value={confirmPassword} onChange={handleChange} label="Confirm Password" type="password" />
            </Grid>
            <Grid item xs={12}>
              <FormControl required fullWidth>
                <InputLabel required variant="outlined">
                  Select a question
                </InputLabel>
                <Select variant="outlined" value={question} onChange={(e) => setQuestion(e.target.value)} label="Select a question">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {questionList.map((el) => (
                    <MenuItem key={el.id} value={el.id}>
                      {el.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth variant="outlined" name="answer" label="Your answer" required value={answer} onChange={handleChange} />
            </Grid>
          </Grid>
          <div className={classes.wrapper}>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} disabled={loading}>
              Register
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
