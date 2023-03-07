import express from "express";
import welcome from "../controllers/welcomeController.js";

const router = express.Router();

/**
 * @openapi
 *  /api-docs:
 *      get:
 *          summary: welcome message
 *          description: message Test controller OK!   
 */

router.route("/").get(welcome);

export default router;