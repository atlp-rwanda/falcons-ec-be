import db from '../database/models/index';
const { blacklisToken } = db;

export const checkBlacklist = async (req, res, next) => {
    try {    
        const token = req.headers.authorization.split(' ')[1];

        const blacklistedToken = await blacklisToken.findOne({ where: { token } });

        if (blacklistedToken) {
            return res.status(400).json({ message: 'Token blacklisted, login again' });
        }
            next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};