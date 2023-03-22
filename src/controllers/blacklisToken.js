// const { BlacklistToken } = require('../database/models/tokenBlacklist');
import db from '../database/models/index';
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken')

const {BlacklistToken} = db;

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const UserId = decodedToken.id;

    // Add token to blacklist
    await BlacklistToken.create({
      token,
      UserId,
      // createdAt: new Date(),
      // updatedAt: new Date(),
      expiresAt: new Date(),
    });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
