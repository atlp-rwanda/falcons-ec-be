import express from 'express';
import { getAllUsers, loginUser } from '../controllers/userController';
import isLoggedIn from '../middleware/authMiddleware';
import userSchema from '../middleware/validation/validation';
import validate from '../middleware/validation/validationMiddleware';

const userRoutes = express.Router();

userRoutes.get('/users', isLoggedIn, getAllUsers);
userRoutes.post('/users/signin', validate(userSchema), loginUser);

export default userRoutes;
