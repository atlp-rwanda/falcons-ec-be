import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import dotenv from 'dotenv';
import db from '../database/models';

const { User } = db;

dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/google/callback`,
      passReqToCallBack: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const googleUser = await User.findOne({
        where: { email: [profile.email] },
      });
      if (googleUser) {
        done(null, profile);
      }
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user);
});
