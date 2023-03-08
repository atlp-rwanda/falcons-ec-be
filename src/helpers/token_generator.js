import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import '../config/passport';

dotenv.config();

const generateToken = async (payload) => {
  const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return token;
};
export default generateToken;
