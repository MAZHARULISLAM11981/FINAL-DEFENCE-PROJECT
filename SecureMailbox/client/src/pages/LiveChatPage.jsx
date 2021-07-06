import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  CssBaseline,
  Grid,
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Avatar,
  List,
  ListItem,
  Badge,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
} from "@material-ui/core";
import { deepPurple, blue, grey } from "@material-ui/core/colors";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import app from "../utils/features";
import moment from "moment";
import axios from "axios";

const useStyles = makeStyles(() => ({
  messages: {
    height: "56vh",
    overflow: "auto",
    backgroundColor: "",
  },
  sent: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 10,
    position: "relative",
  },
  sentMsgTime: {
    position: "absolute",
    right: 0,
    bottom: -10,
    color: grey[700],
  },
  received: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 10,
    position: "relative",
  },
  receivedMsgTime: {
    position: "absolute",
    left: 0,
    bottom: -10,
    color: grey[700],
  },
  receivedMessage: {
    padding: 10,
    borderRadius: 15,
    maxWidth: "20em",
    backgroundColor: deepPurple[50],
  },
  sentMessage: {
    padding: 10,
    borderRadius: 15,
    maxWidth: "20em",
    backgroundColor: blue[50],
  },
  card: {
    position: "relative",
  },
  messageField: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "38em",
  },
  messageButton: {
    position: "absolute",
    bottom: 8,
    right: 10,
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

function LiveChatPage() {
  const classes = useStyles();
  const messagesEndRef = useRef(null);

  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState({ userEmail: "", userName: "" });
  const { userEmail, userName } = selectedUser;
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [showTime, setShowTime] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/users", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.status === "ok") {
          const currentUser = localStorage.getItem("email");
          const filteredUsers = res.data.data.filter((el) => el.role !== "admin" && el.email !== currentUser);
          setUsers([...filteredUsers].reverse());
        } else {
          Notification("Error", `${res.data.message}`, "error");
        }
      })
      .catch(() => Notification("Error", "Your session has expired. Please login again", "error"))
      .finally(() => setLoading(false));
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // second use effect to scroll functionality
  useEffect(scrollToBottom, [data]);

  const handleListItemClick = async (item) => {
    setSelectedUser({ userEmail: item.email, userName: item.fullName });
    await fetchData(item.email);
    await app.service("chats").on("created", fetchData);
  };

  const fetchData = async (response) => {
    try {
      let toEmail;
      if (response.data) {
        toEmail = response.data.to;
      } else {
        toEmail = response;
      }

      if (localStorage.getItem("email") === toEmail) {
        toEmail = response.data.from;
      }

      const chatInfo = await app.service("chats").find({
        query: {
          from: localStorage.getItem("email"),
          to: toEmail,
        },
      });

      const resData = [];
      chatInfo.data.map((el) =>
        resData.push({
          key: el._id,
          message: el.message,
          type: el.type,
          createAt: el.createAt,
        })
      );
      setData(resData);
    } catch (error) {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const body = {
      message,
      from: localStorage.getItem("email"),
      to: userEmail,
    };
    await app.service("chats").create(body);
    setMessage("");
  };

  return (
    <div>
      <Container maxWidth="md" style={{ marginTop: "3em" }}>
        <CssBaseline />
        <Grid container spacing={2}>
          {/* Chat list users */}
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" justifyContent="center">
                  <Typography variant="h6">Chat List</Typography>
                </Box>
                <List style={{ maxHeight: "50vh", overflow: "auto" }}>
                  {loading ? (
                    <Box display="flex" justifyContent="center">
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      {users.map((el) => (
                        <>
                          {el.status ? (
                            <ListItem button key={el._id} onClick={() => handleListItemClick(el)}>
                              <ListItemAvatar>
                                <StyledBadge
                                  overlap="circle"
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                  }}
                                  variant="dot">
                                  <Avatar />
                                </StyledBadge>
                              </ListItemAvatar>
                              <ListItemText primary={el.fullName} />
                            </ListItem>
                          ) : (
                            <ListItem button key={el._id} onClick={() => handleListItemClick(el)}>
                              <ListItemAvatar>
                                <Avatar />
                              </ListItemAvatar>
                              <ListItemText primary={el.fullName} />
                            </ListItem>
                          )}
                        </>
                      ))}
                    </>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          {/* Chat messages */}
          <Grid item xs={12} sm={8}>
            <Card style={{ height: "70vh" }} className={classes.card}>
              <CardContent>
                {userName ? (
                  <Box display="flex" justifyContent="flex-start" mb={4}>
                    <Typography style={{ color: "#1b5e20" }}>
                      Chat with <span style={{ fontWeight: "bold" }}>{userName}</span>
                    </Typography>
                  </Box>
                ) : (
                  <Box display="flex" justifyContent="center">
                    <Typography variant="h5" style={{ color: "#d84315" }}>
                      Please select a user for conversation
                    </Typography>
                  </Box>
                )}
                <Box className={classes.messages}>
                  {data.length > 0 ? (
                    <>
                      {data.map((el) => (
                        <>
                          <div className={el.type === "Send" ? classes.sent : classes.received} key={el.key}>
                            <Box
                              display="flex"
                              justifyContent={el.type === "Send" ? "flex-end" : "flex-start"}
                              className={el.type === "Send" ? classes.sentMessage : classes.receivedMessage}
                              mb={1}
                              onMouseEnter={() => setShowTime(true)}
                              onMouseLeave={() => setShowTime(false)}>
                              {el.message}
                            </Box>
                            {showTime && (
                              <Typography variant="caption" className={el.type === "Send" ? classes.sentMsgTime : classes.receivedMsgTime}>
                                {moment(el.createAt).fromNow()}
                              </Typography>
                            )}
                          </div>
                          <div ref={messagesEndRef} />
                        </>
                      ))}
                    </>
                  ) : (
                    <Box display="flex" justifyContent="center">
                      <Typography>Message Not Found. Start Chatting</Typography>
                    </Box>
                  )}
                </Box>
                <form onSubmit={sendMessage}>
                  <TextField variant="outlined" placeholder="Type your message" className={classes.messageField} value={message} name="message" onChange={(e) => setMessage(e.target.value)} />
                  <IconButton type="submit" className={classes.messageButton} color="secondary">
                    <SendIcon />
                  </IconButton>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default LiveChatPage;
