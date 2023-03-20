import express from 'express';
import updatePassword from '../../controllers/password.update';
import Password from '../../services/passwordSchema';
import validator from '../../validations/validation';
import isLoggedIn from '../../middleware/authMiddleware';

const passwordRouter = express.Router();

passwordRouter.patch('/api/v1/users/:userId/password', isLoggedIn, validator(Password), updatePassword);

export default passwordRouter;
