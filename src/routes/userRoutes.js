import express from 'express';
import { getAllUsers, loginUser, registerUser } from '../controllers/userController';
import isLoggedIn, { checkUserExists } from '../middleware/authMiddleware';
import userSchema from '../middleware/validation/validation';
import validate from '../middleware/validation/validationMiddleware';
import validateRegister from '../validations/register.validation';

const userRoutes = express.Router();

userRoutes.get('/users', isLoggedIn, getAllUsers);
userRoutes.post('/users/signin', validate(userSchema), loginUser);
userRoutes.post(
  '/users/register',
  validateRegister,
  checkUserExists,
  registerUser
);

export default userRoutes;
