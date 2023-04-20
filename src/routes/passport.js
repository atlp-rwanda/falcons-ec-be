import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config()

const passportRouter = express.Router();

passportRouter.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});
passportRouter.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);

passportRouter.get(
  '/google/callback',
  passport.authenticate('google'),
  function(req, res) {
    // Access the authenticated user object from the req.user object and generate a token
    const user = req.user;
    console.log(user)
    const payload = { user_id: user.id};
    const secretKey = process.env.JWT_SECRET  ;
    const expirationTime = '7d';
    const token = jwt.sign(payload, secretKey, { expiresIn: expirationTime });
    
    // Send the token in the response
    res.json({ token: token });
  }
);
// passportRouter.get('/welcome', (req, res) => {
//   const token = req.query.token;
//   res.send(`Token: ${token}`);
// });

export default passportRouter;
