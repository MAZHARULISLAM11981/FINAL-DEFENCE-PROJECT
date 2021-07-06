import React, { useEffect, useState } from "react";
import { Avatar, Box, Chip, CircularProgress, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from "@material-ui/core";
import MailIcon from "@material-ui/icons/Mail";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { makeStyles } from "@material-ui/core/styles";
import Notification from "./Notification";
import { green, pink, blueGrey } from "@material-ui/core/colors";
import moment from "moment";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
  green: {
    color: "#fff",
    backgroundColor: green[500],
  },
}));

function MailListComponent() {
  const classes = useStyles();

  const [mailList, setMailList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMailList = () => {
    setLoading(true);
    const currentEmail = localStorage.getItem("email");
    axios
      .get(`/emails/${currentEmail}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data.status === "ok") {
          setMailList([...res.data.data].reverse());
        } else {
          Notification("Error", `${res.data.message}`, "error");
        }
      })
      .catch(() => Notification("Error", "Your session has expired. Please login again", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => getMailList(), []);

  const readMail = (el) => {
    console.log(el);
    axios
      .patch(
        `/emails/${el._id}`,
        { status: false },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        getMailList();
      })
      .catch((err) => {
        if (err.data.response.message) {
          Notification("Error", `${err.data.response.message}`, "error");
        } else {
          Notification("Error", "Something went wrong. Please check your internet connection.", "error");
        }
      });
  };

  return (
    <div>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : mailList.length !== 0 ? (
        <List>
          {mailList.map((el) => (
            <>
              <ListItem key={el._id}>
                <ListItemAvatar>
                  <Avatar className={el.type === "Received" && el.status ? classes.green : classes.blueGrey}>
                    <MailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{el.subject}</Typography>}
                  secondary={
                    <Typography variant="body2" style={{ color: "#696969", width: "50em" }}>
                      {el.message}
                    </Typography>
                  }
                />

                <Divider orientation="vertical" />

                <Chip variant="outlined" size="small" label={el.type === "Send" ? "Sent" : "Received"} color={el.type === "Send" ? "secondary" : "primary"} />
                <Box px={2}>
                  <Chip label={moment(el.createAt).fromNow()} />
                </Box>
                <Tooltip title="Download file">
                  <IconButton aria-label="download" href={el.filePath} target="_blank" onClick={() => readMail(el)}>
                    <ArrowDownwardIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          ))}
        </List>
      ) : (
        <Box display="flex" justifyContent="center">
          <Typography variant="h3">Mail not available</Typography>
        </Box>
      )}
    </div>
  );
}

export default MailListComponent;
