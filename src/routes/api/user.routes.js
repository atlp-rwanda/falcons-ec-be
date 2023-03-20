import express from 'express';
import validateRegister from '../../validations/register.validation';
import { checkUserExists } from '../../middlewares/user.middleware';
import { RegisterController } from '../../controllers/user.controller';

const router = express.Router();

router.post(
  '/users/register',
  [validateRegister,
  checkUserExists],
  RegisterController.registerUser
  );

export default router;
