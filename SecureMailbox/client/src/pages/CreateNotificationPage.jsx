import React, { useState } from "react";
import { Box, Button, Container, Grid, TextField, Typography } from "@material-ui/core";
import Notification from "../components/Notification";
import { useHistory } from "react-router-dom";
import axios from "axios";

function CreateNotificationPage() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ title: "", details: "" });
  const { title, details } = notification;

  const handleChange = (e) => {
    setNotification({ ...notification, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    if (title === "" || details === "") {
      return Notification("Warning", "All fields are required", "warning");
    } else {
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (handleValidation()) {
      axios
        .post(
          "/notifications",
          { subject: title, message: details },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.status === "ok") {
            Notification("Success", "Notification sent successfully", "success");
            setNotification({ title: "", detail: "" });
            history.push("/notification-list");
          } else {
            Notification("Error", `${res.data.message}`, "error");
          }
        })
        .catch(() => Notification("Error", "Your session has expired. Please login again", "error"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="center" my={5}>
        <Typography variant="h5">Create Notification</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField variant="outlined" label="Notification Title" name="title" value={title} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField variant="outlined" label="Details" name="details" value={details} onChange={handleChange} fullWidth multiline rows={4} />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
            Create Notification
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default CreateNotificationPage;
