import { Router } from 'express';
import userRoutes from './userRoutes';
import welcomeRoutes from './welcomeRoute';
<<<<<<< HEAD
import userRoutes from './userRoutes';

const router = Router();

router.use('/api/v1/welcome', welcomeRoutes);
router.use(userRoutes);
=======

const router = Router();

router.use('/welcome', welcomeRoutes);
router.use('/users', userRoutes);

>>>>>>> f9caf98 (make it better)
export default router;
