import express from 'express';
import welcome from '../controllers/welcomeController';
import validateRegister from '../validations/register.validation';
import { RegisterController } from '../controllers/user.controller';
import checkUserExists from '../middlewares/user.middleware';

const welcomeRoute = express.Router();

welcomeRoute.route('/').get(welcome);

export default welcomeRoute;
