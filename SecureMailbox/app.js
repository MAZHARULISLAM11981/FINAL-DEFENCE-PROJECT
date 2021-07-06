import feathers from "@feathersjs/feathers";
import express from "@feathersjs/express";
import socketio from "@feathersjs/socketio";
import authorizedUser from "./src/middlewares/authorizedUser";
import SignUp from "./src/services/Auth/SignUp";
import SignIn from "./src/services/Auth/SignIn";
import LogOut from "./src/services/Auth/LogOut";
import Forget from "./src/services/Auth/Forget";
import Users from "./src/services/Admin/Users";
import Emails from "./src/services/Emails/Emails";
import Chats from "./src/services/Chats/Chats";
import Notifications from "./src/services/Notifications/Notifications";
import Alert from "./src/services/Notifications/Alert";
import GlobalErrorHandler from "./src/utils/errors/GlobalErrorHandler";
import cors from "cors";
import AppError from "./src/utils/errors/AppError";
import "./src/config/ImportEnv";
import "./src/config/dbConfig";

const app = express(feathers());

// Parse JSON
app.use(express.json());
app.use(cors());

// Config socket.io realtime APIs
app.configure(socketio());

// Enable REST services
app.configure(express.rest());

// Auth
app.use("/api/auth/signup", new SignUp());
app.use("/api/auth/signin", new SignIn());
app.use("/api/auth/logout", new LogOut());

// Forget
app.use("/api/auth/forget", new Forget());

// Admin
app.use("/api/users", authorizedUser, new Users());

// Email
app.use("/api/emails", authorizedUser, new Emails());

// Chats
app.use("/chats", authorizedUser, new Chats());

// Notification
app.use("/api/notifications", authorizedUser, new Notifications());
app.use("/api/alert", authorizedUser, new Alert());

// Docs
app.use("/docs", (req, res) => {
  res.redirect("https://documenter.getpostman.com/view/9978541/TzK2Ytab");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalErrorHandler);

// New connections connect to stream channel
app.on("connection", (con) => app.channel("stream").join(con));

// Publish events to stream
app.publish((data) => app.channel("stream"));

const PORT = process.env.PORT || 5000;

app.listen(PORT).on("listening", () => {
  console.log(`Server running on port ${PORT}`);
});
