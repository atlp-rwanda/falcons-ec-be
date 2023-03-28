import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import "../config/passport";

dotenv.config();

const generateToken = async (payload, lifeSpan = '7d') => {
  const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: lifeSpan,
  });
  return token;
};

export default generateToken;
