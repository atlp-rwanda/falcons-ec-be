import express from 'express';
import {
  getAllUsers,
  loginUser,
  setRoles,
  createNewUser,
  updatePassword
} from '../controllers/userController';
import isLoggedIn from '../middleware/authMiddleware';
import { userSchema, Password} from '../validations/userSchema'
import validator from '../validations/validation'
import verifyRole from '../middleware/verifyRole';

const userRoutes = express.Router();

userRoutes.get('/api/v1/users', isLoggedIn, getAllUsers);
userRoutes.post('/api/v1/users/signin', validator(userSchema), loginUser);
userRoutes.post('/api/v1/users/signup', validator(userSchema), createNewUser);
userRoutes.put('/api/v1/users/:id/roles', verifyRole('admin'), setRoles);
userRoutes.patch('/api/v1/users/:userId/password', isLoggedIn, validator(Password), updatePassword);

export default userRoutes;
