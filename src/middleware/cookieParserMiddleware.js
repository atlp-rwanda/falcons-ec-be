// const jwt = require('jsonwebtoken');
// const { User } = require('../database/models/user');

// const authenticateMiddleware = async (req, res, next) => {
//   try {
//     const accessToken = req.cookies.accessToken;

//     if (!accessToken) {
//       throw new Error('Access token not found.');
//     }

//     const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

//     const user = await User.findOne({ where: { id: decoded.id } });

//     if (!user) {
//       throw new Error('User not found.');
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Unauthorized.' });
//   }
// };

// const cookieParserMiddleware = (req, res, next) => {
//   const rawCookies = req.headers.cookie.split('; ');
//   const parsedCookies = {};

//   rawCookies.forEach((rawCookie) => {
//     const parsedCookie = rawCookie.split('=');
//     parsedCookies[parsedCookie[0]] = parsedCookie[1];
//   });

//   req.cookies = parsedCookies;

//   next();
// };

// module.exports = { authenticateMiddleware, cookieParserMiddleware };
