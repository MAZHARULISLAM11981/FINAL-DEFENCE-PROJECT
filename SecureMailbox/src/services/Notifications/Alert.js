import AlertModel from '../../models/Alert';
import sendData from '../../utils/response/sendData';

class Alert {
  async get (email) {
    const emailInfo = await AlertModel.count({ email, name: 'email' });
    const messageInfo = await AlertModel.count({ email, name: 'message' });

    return sendData('ok', {
      email: emailInfo,
      message: messageInfo
    });
  }
}

export default Alert;
