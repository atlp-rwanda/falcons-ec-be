import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import swaggerUI from 'swagger-ui-express';
import welcomeRoute from './routes/welcomeRoute';
import swagger from './swagger.json';
import './config/passport';
import passportRouter from './routes/passport';
// import dummyRoutes from './routes/dummyRoutes';
import router from './routes';
// import dummyRoutes from './routes/dummyRoutes';
import productRoute from './routes/product';

export const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// app.use('/api/v1', dummyRoutes);
app.use('/', passportRouter);
app.use('/welcome', welcomeRoute);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));
app.use(router);
export default app;
