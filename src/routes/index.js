import { Router } from 'express';
// import dummyRoutes from './dummyRoutes';
import welcomeRoutes from './welcomeRoute';
import passwordRouter from './userRoutes/index';
import userRoutes from './userRoutes';

const router = Router();

router.use('/api/v1/welcome', welcomeRoutes);
// router.use('/api/v1/users', dummyRoutes);
router.use(passwordRouter);
router.use(userRoutes);
export default router;
