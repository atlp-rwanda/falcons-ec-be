import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import welcomeRoutes from "./src/routes/welcomeRoute.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/welcome", welcomeRoutes);

export default app;
