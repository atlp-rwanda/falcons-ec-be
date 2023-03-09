import { Router } from 'express';
import dummyRoutes from './dummyRoutes';
import welcomeRoutes from './welcomeRoute';

const router = Router();

router.use('/welcome', welcomeRoutes);
router.use('/users', dummyRoutes);

export default router;
