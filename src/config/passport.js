import * as dotenv from 'dotenv';
import BcryptUtil from 'bcrypt';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import db from '../database/models/index';
import generateToken from '../helpers/token_generator';

const { User } = db;

dotenv.config();
const { GOOGLE_CLIENT_ID } = process.env;
const { GOOGLE_CLIENT_SECRET } = process.env;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.URL}/google/callback`,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        // eslint-disable-next-line camelcase
        const { given_name } = profile;
        const useremail = profile.emails && profile.emails[0].value;
        const googleUser = await User.findOne({
          where: { email: [profile.email] },
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
          console.log('The user is saved in our db!!!!!!');
          console.log(TOKEN);
          done(null, profile);
        } else {
          const user = await User.create({
            // eslint-disable-next-line camelcase
            name: given_name,
            email: useremail,
            password: await BcryptUtil.hash('password', 10),
          });
          user.save();
          TOKEN = generateToken(userObject);
          console.log('The user is saved in our db!!!!!!');
          console.log(TOKEN);
          done(null, profile);
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
