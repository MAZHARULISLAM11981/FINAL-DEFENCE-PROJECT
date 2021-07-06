import Notification from '../../models/Notification';
import User from '../../models/User';
import sendData from '../../utils/response/sendData';
import sendMessage from '../../utils/response/sendMessage';
import emailValidator from '../../utils/validators/Email';

class Notifications {
  async find () {
    const notificationInfo = await Notification.find();
    return sendData('ok', notificationInfo);
  }

  async create (body) {

    const {
      subject,
      message,
    } = body;

    // body verification
    if (!subject) return sendMessage('fail', 'provide notification subject');
    if (!message) return sendMessage('fail', 'provide notification message');

    const notificationInfo = await Notification.create({
      subject,
      message,
      createAt: Date.now()
    });

    return sendData('ok', notificationInfo);
  }
}

export default Notifications;
