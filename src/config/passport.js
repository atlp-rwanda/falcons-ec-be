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
      try {
        const { given_name } = profile;
        const googleUser = await User.findOne({
          where: { email: [] },
        });
        let TOKEN;
        const userObject = {
          // eslint-disable-next-line camelcase
          name: given_name,
          email: profile.email,
          token: TOKEN,
        };

        if (googleUser) {
          TOKEN = generateToken(userObject);
          done(null, profile);
        }
      } catch (error) {
        ;
      }
    },
  ),
);
