import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import swaggerUI from 'swagger-ui-express'
import swaggerJSDoc from "swagger-jsdoc";
import welcomeRoutes from "./src/routes/welcomeRoute.js";
import { options } from "./src/documentation/index.js";

export const app = express();

const swaggerSpec = swaggerJSDoc(options)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/welcome", welcomeRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

export default app;