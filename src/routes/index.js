import { Router } from 'express';
import welcomeRoutes from './welcomeRoute';
import userRoutes from './userRoutes';

const router = Router();

router.use('/api/v1/welcome', welcomeRoutes);
router.use(userRoutes);
export default router;
