import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import swaggerUI from 'swagger-ui-express';
import allRoutes from './routes/index';
import welcomeRoute from './routes/welcomeRoute';
import swagger from '../src/swagger.json'
import './config/passport';
import passportRouter from './routes/passport';
import dummyRoutes from './routes/dummyRoutes';

export const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false,
  }),
);
app.unsubscribe('/users', dummyRoutes);
app.use('/', passportRouter);
app.use('/', allRoutes);
app.use('/welcome', welcomeRoute);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));
export default app;
