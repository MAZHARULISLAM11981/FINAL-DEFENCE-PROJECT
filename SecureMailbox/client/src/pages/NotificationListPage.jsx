import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";
import moment from "moment";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  notificationPanel: {
    backgroundColor: blueGrey[50],
    borderRadius: 10,
  },
}));

function NotificationListPage() {
  const classes = useStyles();

  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/notifications", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.status === "ok") {
          console.log(res.data.data);
          setNotificationList([...res.data.data].reverse());
        } else {
          Notification("Error", `${res.data.message}`, "error");
        }
      })
      .catch(() => {
        Notification("Error", "Your session has expired. Please login again", "error");
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <Container maxWidth="md">
        <Box my={4} display="flex" justifyContent="center">
          <Typography variant="h4">Admin Message</Typography>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : notificationList.length !== 0 ? (
          <>
            {notificationList.map((el) => (
              <Box display="flex" justifyContent="flex-start" className={classes.notificationPanel} p={2} mb={1} key={el._id}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">{el.subject}</Typography>
                    <Typography variant="caption">{moment(el.createAt).fromNow()}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">{el.message}</Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </>
        ) : (
          <Box display="flex" justifyContent="center">
            <Typography variant="h3"> Notification list is empty </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
}

export default NotificationListPage;
