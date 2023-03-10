import express from 'express';
import passport from 'passport';
import generateToken from '../helpers/token_generator';

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
  passport.authenticate('google', {
    successRedirect: '/welcome',
    failureRedirect: '/auth/google',
  }),
);

export default passportRouter;
