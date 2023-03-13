import express from 'express';
import { createNewUser, getAllUsers } from '../controllers/dummyController';

const dummyRoutes = express.Router();

dummyRoutes.route('/').get(getAllUsers).post(createNewUser);

export default dummyRoutes;
