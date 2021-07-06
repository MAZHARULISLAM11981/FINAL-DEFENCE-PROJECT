import User from '../../models/User'
import sendData from '../../utils/response/sendData';

class Users {
  async find () {
    const userInfo = await User.find();
    
    return sendData('ok', userInfo);
  }
}

export default Users;
