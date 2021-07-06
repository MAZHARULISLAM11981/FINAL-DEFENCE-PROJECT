import "react-notifications/lib/notifications.css";
import { NotificationManager } from "react-notifications";

function Notification(message, description, type) {
  switch (type) {
    case "info":
      NotificationManager.info(`${description}`, `${message}`);
      break;
    case "success":
      NotificationManager.success(`${description}`, `${message}`);
      break;
    case "warning":
      NotificationManager.warning(`${description}`, `${message}`);
      break;
    case "error":
      NotificationManager.error(`${description}`, `${message}`);
      break;
    default:
      break;
  }
}

export default Notification;
