import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import swaggerUI from 'swagger-ui-express';
import Stripe from 'stripe';
import swagger from './swagger.json';
import './config/passport';
import passportRouter from './routes/passport';
import router from './routes';
import productRoute from './routes/productRoutes';
import categoryRoute from './routes/categoryRoutes';
import cartRoute from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import { webhookProcessor } from './controllers/checkoutController';

const stripe = new Stripe(process.env.STRIPE_API_KEY);

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
app.use('/api/v1', productRoute);
app.use('/api/v1', categoryRoute);
app.use('/api/v1', cartRoute);
app.use('/api/v1', orderRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));
app.use('/', passportRouter);
app.use(router);

app.post('/webhook', webhookProcessor);

export default app;
