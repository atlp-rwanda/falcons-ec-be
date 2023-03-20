import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.split('')[1];

    if (!authHeader) {
      return res.status(403).json({ error: 'access denied' });
    }
    const result = Jwt.verify(bearerToken, process.env.SECRET_KEY);
    req.user = result;
    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
export default authMiddleware;
