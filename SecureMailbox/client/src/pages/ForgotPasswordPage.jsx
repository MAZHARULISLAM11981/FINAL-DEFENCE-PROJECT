import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Notification from "../components/Notification";
import { useHistory } from "react-router-dom";
import { questionList } from "../utils/constants";
import { Button, Container, CssBaseline, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
function ForgotPasswordPage() {
  const classes = useStyles();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    console.log(answer);
    if (!password) {
      console.log("not password");
      axios
        .post("/auth/forget", { email: email, answer: answer })
        .then((res) => {
          if (res.data.status === "fail") {
            Notification("Error", `${res.data.message}`, "error");
          } else {
            setIsVerified(true);
          }
        })
        .catch((err) => {
          if (err.data.response.message) {
            Notification("Error", `${err.data.response.message}`, "error");
          } else {
            Notification("Error", "Something went wrong. Please check your internet connection.", "error");
          }
        });
    } else {
      axios
        .patch("/auth/forget", { email: email, password: password })
        .then((res) => {
          console.log(res);
          Notification("Success", `${res.data.message}`, "success");
          history.push("/");
        })
        .catch((err) => {
          if (err.data.response.message) {
            Notification("Error", `${err.data.response.message}`, "error");
          } else {
            Notification("Error", "Something went wrong. Please check your internet connection.", "error");
          }
        });
    }
  };

  return (
    <div>
      <Container maxWidth="xs" component="main">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h4">
            Forgot Password
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth variant="outlined" value={email} label="Enter your email" required onChange={(e) => setEmail(e.target.value)} />
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
                <TextField fullWidth variant="outlined" label="Your answer" required value={answer} onChange={(e) => setAnswer(e.target.value)} />
              </Grid>
              {isVerified && (
                <Grid item xs={12}>
                  <TextField fullWidth type="password" variant="outlined" label="New Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </Grid>
              )}
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} disabled={loading}>
                Verify yourself
              </Button>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default ForgotPasswordPage;
