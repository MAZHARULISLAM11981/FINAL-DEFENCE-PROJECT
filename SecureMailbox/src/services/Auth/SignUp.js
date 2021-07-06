import User from "../../models/User";
import sendMessage from "../../utils/response/sendMessage";
import userValidator from "../../utils/validators/User";

class SignUp {
  async create(body) {
    const { fullName, email, password, answer, role } = body;

    // body verification
    const message = userValidator(body);
    if (message !== "ok") return sendMessage("fail", message);

    // check duplicate
    const checkDuplicate = await User.findOne({ email });
    if (checkDuplicate) return sendMessage("fail", "Email is already in use. Please give unique email.");

    const userInfo = await User.create({
      fullName,
      email,
      answer,
      role,
      createAt: Date.now(),
    });
    userInfo.password = await userInfo.hashPassword(password);
    await userInfo.save();

    return sendMessage("ok", "User created successfully");
  }
}

export default SignUp;
