import { UserService } from '../services/user.service';
import { BcryptUtility } from '../utils/bcrypt.util';
import { JwtUtility } from '../utils/jwt.util';

export class RegisterController {
  static async registerUser(req, res) {
    try {
      const user = { ...req.body };
      user.password = await BcryptUtility.hashPassword(req.body.password);
      const { id, email } = await UserService.register(user);
      const userData = { id, email };
      const userToken = JwtUtility.generateToken(userData);
      return res.status(201).json({ user: userData, token: userToken });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
        message: 'Failed to register a new user',
      });
    }
  }
}
