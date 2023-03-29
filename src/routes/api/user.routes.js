import express from 'express';
import validateRegister from '../../validations/register.validation';
import { checkUserExists } from '../../middleware/user.middleware';
import { registerUser } from '../../controllers/userController';

const router = express.Router();

router.post(
  '/users/register',
  [validateRegister,
    checkUserExists],
  registerUser
);

export default router;
