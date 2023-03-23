import express from 'express';
import {logout} from "../controllers/blacklisTokenController"
import isLoggedIn from '../middleware/authMiddleware';
import { checkBlacklist } from '../middleware/checkTokenMiddleware';

const logoutRoutes = express.Router();

logoutRoutes.post('/users/logout', isLoggedIn, checkBlacklist, logout);

export default logoutRoutes;