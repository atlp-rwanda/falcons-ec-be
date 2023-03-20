import express from 'express';
import {
  createNewUser,
  getAllUsers,
  loginUser,
  setRoles,
} from '../controllers/userController';
import isLoggedIn from '../middleware/authMiddleware';
import userSchema from '../middleware/validation/validation';
import validate from '../middleware/validation/validationMiddleware';
import verifyRole from '../middleware/verifyRole';

const userRoutes = express.Router();

userRoutes.get('/api/v1/users', isLoggedIn, getAllUsers);
userRoutes.post('/api/v1/users/signin', validate(userSchema), loginUser);
userRoutes.post('/api/v1/users/signup', validate(userSchema), createNewUser);
userRoutes.put('/api/v1/users/:id/roles', verifyRole('admin'), setRoles);

export default userRoutes;
