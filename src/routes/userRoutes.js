import express from 'express';
import {
  getAllUsers,
  loginUser,
  setRoles,
  createNewUser,
  updatePassword,
  disableAccount,
  registerUser
} from '../controllers/userController';
import { userSchema, Password } from '../validations/userSchema';
import validator from '../validations/validation';
import verifyRole from '../middleware/verifyRole';
import validateRegister from '../validations/register.validation';
import isLoggedIn, { checkUserExists } from '../middleware/authMiddleware';
import {logout} from "../controllers/blacklisTokenController"

const userRoutes = express.Router();

userRoutes.get('/api/v1/users', isLoggedIn, getAllUsers);
userRoutes.post('/api/v1/users/signin', validator(userSchema), loginUser);
userRoutes.post('/api/v1/users/signup', validator(userSchema), createNewUser);
userRoutes.put('/api/v1/users/:id/roles', verifyRole('admin'), setRoles);
userRoutes.patch('/api/v1/users/:id/status', verifyRole('admin'), disableAccount);
userRoutes.patch('/api/v1/users/:userId/password', isLoggedIn, validator(Password), updatePassword);
userRoutes.post('/api/v1/users/register', validateRegister, checkUserExists, registerUser);
userRoutes.post('/api/v1/users/logout', isLoggedIn, logout);


export default userRoutes;
