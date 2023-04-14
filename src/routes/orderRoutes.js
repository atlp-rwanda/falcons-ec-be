import express from 'express';
import validator from '../validations/validation';
import verifyRole from '../middleware/verifyRole';
import { checkout } from '../controllers/checkoutController';

const orderRoutes = express.Router();

orderRoutes.post('/orders/checkout', verifyRole('buyer'), checkout);

export default orderRoutes;
