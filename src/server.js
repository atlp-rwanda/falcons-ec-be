import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import swaggerUI from 'swagger-ui-express';
import allRoutes from './routes/index';
import welcomeRoute from './routes/welcomeRoute';
import swagger from '../src/swagger.json';
import googleCallBack from './middlewares/googleCallback';
import './config/passport';

dotenv.config();

export const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', allRoutes);
app.use('/welcome', welcomeRoute);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));
app.use('/', allRoutes);
app.use(
  session({
    secret: process.env.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false,
  }),
);

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);

app.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/welcome',
    failureRedirect: '/auth/google',
  }),
);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));

export default app;
