import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import swaggerUI from 'swagger-ui-express';
import allRoutes from './routes/index';
import welcomeRoute from './routes/welcomeRoute';
import swagger from '../src/swagger.json';
import './config/passport';
import passportRouter from './routes/passport';
import router from './routes';
import productRoute from './routes/productRoutes';
import logoutRoutes from './routes/logout';


export const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', productRoute);
app.use('/api/v1', logoutRoutes);
app.use('/welcome', welcomeRoute);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));
app.use('/', passportRouter);
app.use(router);
app.use(
  session({
    secret: process.env.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false,
  }),
);
export default app;
