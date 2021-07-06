import User from '../../models/User';
import Token from '../../models/Token';
import sendMessage from '../../utils/response/sendMessage';

class Forget {
  async create (body) {

    const { email, answer } = body;
    const userInfo = await User.findOne({ email, answer });
    if (!userInfo) return sendMessage('fail', 'Incorrect email or answer.');

   return sendMessage('ok', 'User found');
  }

  async patch (id, body, params) {

    const { email, password } = body;
    const userInfo = await User.findOne({ email });
    userInfo.password = await userInfo.hashPassword(password);
    await userInfo.save();

    return sendMessage("ok", "Password reset successfully");
  }
}

export default Forget;
