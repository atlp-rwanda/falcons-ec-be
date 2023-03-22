import express from 'express';
import {logout} from "../controllers/blacklisToken"
import isLoggedIn, { checkBlacklist } from '../middleware/authMiddleware';

const logoutRoutes = express.Router();

logoutRoutes.get('/users/logout', isLoggedIn, checkBlacklist, logout);

export default logoutRoutes;