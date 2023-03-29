/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import express from 'express';
import multer from 'multer';
import {
  getAllUsers,
  loginUser,
  setRoles,
  createNewUser,
  updatePassword,
  disableAccount,
  registerUser,
  getSingleProfile,
  updateProfile,
} from '../controllers/userController';
import isLoggedIn, { checkPassword, checkUserExists } from '../middleware/authMiddleware';
import { userSchema, Password, profileSchema } from '../validations/userSchema';
import validateRegister from '../validations/register.validation';
import validator from '../validations/validation';
import verifyRole from '../middleware/verifyRole';
import roleSchema from '../validations/roleSchema';
import { logout } from '../controllers/blacklisTokenController';

const userRoutes = express.Router();
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Invalid image file', false);
  }
};
const uploads = multer({ storage, fileFilter });

userRoutes.get('', isLoggedIn,checkPassword,verifyRole('admin'), getAllUsers);
userRoutes.get('/profile/single', isLoggedIn, getSingleProfile);
userRoutes.post('/signin', validator(userSchema), loginUser);
userRoutes.post('/signup', validator(userSchema), createNewUser);
userRoutes.put(
  '/:id/roles',
  [verifyRole('admin'),checkPassword, validator(roleSchema)],
  setRoles,
);
userRoutes.patch('/:id/status', verifyRole('admin'), checkPassword,disableAccount);
userRoutes.patch(
  '/:userId/password',
  isLoggedIn,
  validator(Password),
  updatePassword,
);
userRoutes.post('/register', validateRegister, checkUserExists, registerUser);
userRoutes.post('/logout', isLoggedIn, logout);
userRoutes.patch(
  '/profile',
  [isLoggedIn,uploads.single('avatar'), validator(profileSchema)],
  updateProfile,
);

export default userRoutes;
