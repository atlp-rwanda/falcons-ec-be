<<<<<<< HEAD
// import express from 'express';
// import { getAllUsers } from '../controllers/dummyController';

// const dummyRoutes = express.Router();

// dummyRoutes.route('/').get(getAllUsers);

// export default dummyRoutes;
=======
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
>>>>>>> f983d27b124dafbf776c1b57ed7cddcba9aba2bb
