import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// const verifyToken = (token) => JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//   if (err) {
//     return err;
//   }
//   return decoded;
// });
const verifyToken = (token) => {
  const decoded = JWT.verify(token, process.env.JWT_SECRET);
  return decoded;
};
export default verifyToken;
