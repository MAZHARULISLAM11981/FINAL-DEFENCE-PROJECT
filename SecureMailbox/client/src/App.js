import "./App.css";
import HeaderComponent from "./components/HeaderComponent";
import { NotificationContainer } from "react-notifications";
import { Switch, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MailPage from "./pages/MailPage";
import LiveChatPage from "./pages/LiveChatPage";
import ConversionPage from "./pages/ConversionPage";
import NotificationListPage from "./pages/NotificationListPage";
import CreateNotificationPage from "./pages/CreateNotificationPage";
import RegisteredUserListPage from "./pages/RegisteredUserListPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <div className="App">
      <HeaderComponent />
      <Switch>
        {localStorage.getItem("token") && localStorage.getItem("role") === "user" ? (
          <>
            <Route exact path="/" component={MailPage} />
            <Route exact path="/mails" component={MailPage} />
            <Route exact path="/secure-file" component={ConversionPage} />
            <Route exact path="/live-chat" component={LiveChatPage} />
            <Route exact path="/notification-list" component={NotificationListPage} />
          </>
        ) : localStorage.getItem("token") && localStorage.getItem("role") === "admin" ? (
          <>
            <Route exact path="/" component={RegisteredUserListPage} />
            <Route exact path="/user-list" component={RegisteredUserListPage} />
            <Route exact path="/create-notification" component={CreateNotificationPage} />
            <Route exact path="/notification-list" component={NotificationListPage} />
          </>
        ) : (
          <>
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/forgot-password" component={ForgotPasswordPage} />
          </>
        )}
      </Switch>
      <NotificationContainer />
    </div>
  );
}

export default App;
