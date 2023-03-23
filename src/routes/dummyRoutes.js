import express from "express";
import verifyRole from "../middlewares/verifyRole";
import {
  createNewAdmin,
  createNewUser,
  getAllUsers,
  login,
} from "../controllers/dummyController";

const router = express.Router();

router.route("/").get(getAllUsers).post(createNewUser);
router.route("/createAdmin").post(createNewAdmin); //for testing
router.route("/login").post(login);

export default router;
