/* eslint-disable linebreak-style */
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (token) => {
  const decoded = JWT.verify(token, process.env.JWT_SECRET);
  return decoded;
};
export default verifyToken;
