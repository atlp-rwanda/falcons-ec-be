import { Router } from 'express';
import userRoutes from './userRoutes';
import welcomeRoutes from './welcomeRoute';

const router = Router();

router.use('/welcome', welcomeRoutes);
router.use('/users', userRoutes);

export default router;
