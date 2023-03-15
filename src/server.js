import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import swaggerUI from 'swagger-ui-express';
import allRoutes from './routes/index';
import welcomeRoute from './routes/welcomeRoute';
import swagger from './swagger.json';
import './config/passport';
import passportRouter from './routes/passport';
import userRoutes from './routes/userRoutes';
// import dummyRoutes from './routes/dummyRoutes';
import productRoute from './routes/product';

export const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', allRoutes);
app.use('/api/v1', productRoute);
app.use('/welcome', welcomeRoute);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));
app.use(
  session({
    secret: process.env.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use('/api/v1', userRoutes);
app.use('/', passportRouter);
app.use('/', allRoutes);
app.use('/welcome', welcomeRoute);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));
export default app;
