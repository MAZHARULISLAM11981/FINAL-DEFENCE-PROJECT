import User from '../../models/User'
import sendData from '../../utils/response/sendData';
import sendMessage from '../../utils/response/sendMessage';
import createJWT from '../../middlewares/jwtToken'

class SignIn {
  async create (body) {
    const { email, password } = body;
    
    // body verification
    if (!email) return sendMessage('fail', 'provide your email');
    if (!password) return sendMessage('fail', 'provide your password');

    // check auth
    const userInfo = await User.findOne({
      email,
    }).select('+password');

    if (!userInfo || !(await userInfo.verifyPassword(password, userInfo.password))) {
      return sendMessage('fail', 'Incorrect username or password.');
    }

    userInfo.status = true;
    await userInfo.save();

    return sendData('ok', {
      fullName: userInfo.fullName,
      email: userInfo.email,
      role: userInfo.role,
      token: createJWT(userInfo._id),
    });
  }
}

export default SignIn;