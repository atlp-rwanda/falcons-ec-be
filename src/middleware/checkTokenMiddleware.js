import db from '../database/models/index';
const { blacklisToken } = db;

export const checkBlacklist = async (req, res, next) => {
    try {       
        const token = req.headers.authorization.split(' ')[1];

        const blacklistedToken = await blacklisToken.findOne({ where: { token } });

        if (blacklistedToken) {
            return res.status(200).json({ message: 'Token blacklisted' });
        }

            // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            // req.user = decodedToken;
            next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};