import { Router } from 'express';
import welcomeRoutes from './welcomeRoute';
import UserRoutes from './api/user.routes';
const router = Router();

router.use('/welcome', welcomeRoutes);
router.use('/users', UserRoutes);

export default router;
