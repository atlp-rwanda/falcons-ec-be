/* eslint-disable import/no-named-as-default */
import express from 'express';
import isLoggedIn from '../middleware/authMiddleware';
import CreateCategory, {
  updateCategory,
} from '../controllers/categoryController';
import validator from '../validations/validation';
import categorySchema from '../validations/Category';
import verifyRole from '../middleware/verifyRole';

const categoryRoute = express.Router();

categoryRoute.post(
  '/categories',
  isLoggedIn,
  verifyRole('admin'),
  validator(categorySchema),
  CreateCategory,
);
categoryRoute.patch(
  '/categories/:categoryId',
  isLoggedIn,
  verifyRole('admin'),
  validator(categorySchema),
  updateCategory,
);

export default categoryRoute;
