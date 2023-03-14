import * as dotenv from 'dotenv';
import express from 'express';
import allRoutes from './routes/index';

dotenv.config();

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', allRoutes);

export default app;
