import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import swaggerUI from 'swagger-ui-express'
import swaggerJSDoc from "swagger-jsdoc";

import welcomeRoutes from "./src/routes/welcomeRoute.js";

export const app = express();

const options = {
    definition:{
        openapi: '3.0.0',
        info: {
          title: 'E-commerce API',
          description: 'E-commerce  documentation ',
          version: '1.0.0',
        },

        servers:[{
            url:`http://localhost:${process.env.PORT}`,
        }]
    },
    apis: ['./src/routes/welcomeRoute.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/welcome", welcomeRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

export default app;