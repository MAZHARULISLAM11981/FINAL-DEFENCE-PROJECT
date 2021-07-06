import User from '../../models/User';
import Token from '../../models/Token';
import sendMessage from '../../utils/response/sendMessage';
class LogOut {
  async create (body) {

    const { token, email } = body;
    const userInfo = await User.findOne({ email });
    if (!userInfo) return sendMessage('fail', 'User not found.');

    await Token.create({ token });
    userInfo.status = false;
    await userInfo.save();
   
   return sendMessage('ok', 'Logout successfully');
  }
}

export default LogOut;