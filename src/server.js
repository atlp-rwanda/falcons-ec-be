import * as dotenv from 'dotenv';
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import allRoutes from './routes/index';
import welcomeRoute from './routes/welcomeRoute';
import swagger from '../src/swagger.json';

dotenv.config();

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', allRoutes);
app.use('/welcome', welcomeRoute);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));

export default app;
