import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import generateToken from '../helpers/token_generator';

dotenv.config();

const passportRouter = express.Router();

passportRouter.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});
passportRouter.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

passportRouter.get('/google/callback', passport.authenticate('google'), async (req, res) => {
  // Access the authenticated user object from the req.user object and generate a token
  const { user } = req;
  console.log(user);
  const payload = { id: user.id };
  const token = await generateToken(payload);

  // Send the token in the response
  res.json({ status: 200, message: 'successfully logged in', token });
});
// passportRouter.get('/welcome', (req, res) => {
//   const token = req.query.token;
//   res.send(`Token: ${token}`);
// });

export default passportRouter;
