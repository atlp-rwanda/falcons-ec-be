import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import allRoutes from "./routes/index";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", allRoutes);

export default app;
