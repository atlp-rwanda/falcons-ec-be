/* eslint-disable import/no-named-as-default */
import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
import swagger from './swagger.json';
import './config/passport';
import passportRouter from './routes/passport';
import router from './routes';
import productRoute from './routes/productRoutes';
import categoryRoute from './routes/categoryRoutes';
import cartRoute from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import validator from './validations/validation';
import verifyRole from './middleware/verifyRole';
import isLoggedIn, { checkPassword } from './middleware/authMiddleware';
import { webhookProcessor } from './controllers/checkoutController';
import productWishRoute from './routes/productWishRoutes';
import { getTransactionStatus, requestToPay } from './controllers/momoPayment';
import momoSchema from './validations/momo';

dotenv.config();
export const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use('/api/v1', productRoute);
app.use('/api/v1', productWishRoute);
app.use('/api/v1', categoryRoute);
app.use('/api/v1', cartRoute);
app.use('/api/v1', orderRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));
app.use('/', passportRouter);
app.use(router);

app.post('/webhook', webhookProcessor);
app.post(
  '/momo',
  isLoggedIn,
  checkPassword,
  verifyRole('buyer'),
  validator(momoSchema),
  requestToPay,
  getTransactionStatus,
);

export default app;
