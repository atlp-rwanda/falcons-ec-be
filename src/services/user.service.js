// import { User } from '../database/models/index';
import verifyToken from '../utils/jwt.util';
import db from '../database/models';

const { User } = db;
export class UserService {
  static async register(user) {
    return User.create(user);
  }
}

const getUserRoles = async (userId) => {
  const user = await User.findOne({
    where: {
      id: userId
    }
  });
  const userRole = user.role;
  return userRole;
};
export default getUserRoles;
