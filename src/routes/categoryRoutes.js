import express from 'express';
import isLoggedIn, { isAdmin, isSeller } from '../middleware/authMiddleware';
import CreateCategory, { updateCategory } from '../controllers/categoryController';
import validator from '../validations/validation';
import categorySchema from '../validations/Category';



const categoryRoute = express.Router();

categoryRoute.post(
  '/categories',
  isLoggedIn,
  isAdmin,
  validator(categorySchema),
  CreateCategory
);
categoryRoute.patch(
  '/categories/:categoryId/update',
  isLoggedIn,
  isAdmin,
  validator(categorySchema), 
  updateCategory,
);

export default categoryRoute;
