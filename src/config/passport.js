import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import dotenv from 'dotenv';
import db from '../database/models';
import generateToken from '../helpers/token_generator';

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
        console.log(googleUser)
        const user = {
          id:googleUser.id,
          email: profile.email,
          token: token, // include the token in the user object
        };
        done(null, user,{ status: 200});
      } else {
        return done(null, false, { status: 401, message: 'User not found.' });
      }
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user);
});
