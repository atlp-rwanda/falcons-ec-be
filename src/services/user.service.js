import { User } from '../database/models/index';

export class UserService {
  static async register(user) {
    return User.create(user);
  }
}
