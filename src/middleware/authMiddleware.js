/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import findOneUserService from '../services/authService';
import { User, blacklisToken } from '../database/models/index';

const isLoggedIn = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);

      const blacklistedToken = await blacklisToken.findOne({
        where: { token },
      });

      if (blacklistedToken) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: 'You need to login again',
        });
      }

      const currentUser = await findOneUserService(decodedData.payload.id);
      const userObj = {
        id: currentUser.id,
        email: currentUser.email,
      };
      if (!currentUser) {
        res.status(401).json({
          status: 401,
          success: false,
          message: 'User does not exist!',
          message: 'User does not exist!',
        });
      } else {
        req.user = userObj;
        next();
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: `Error when authorizing user ${error.message}`,
      });
    }
  } else {
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Not logged in',
      message: 'Not logged in',
    });
  }
};

export const checkUserExists = async (req, res, next) => {
  const { email } = req.body;
  const userInDb = await User.findOne({
    where: { email },
  });
  if (userInDb) {
    return res.status(409).json({ message: 'Email already exists' });
  }
  next();
};

export const checkPassword = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const decodedData = jwt.verify(token, `${process.env.JWT_SECRET}`);

    const currentUser = await findOneUserService(decodedData.payload.id);
    if (currentUser.status === false) {
      res.status(419).json({
        status: 419,
        success: false,
        message: 'Update your Password',
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: `Error when authorizing user ${error.message}`,
    });
  }
};
export default isLoggedIn;
