import express from "express";
import {
  createNewUser,
  getAllUsers,
  loginUser,
  setRoles,
} from "../controllers/userController";
import isLoggedIn from "../middleware/authMiddleware";
import userSchema from "../middleware/validation/validation";
import validate from "../middleware/validation/validationMiddleware";
import verifyRole from "../middleware/verifyRole";

const userRoutes = express.Router();

userRoutes.get("/users", isLoggedIn, getAllUsers);
userRoutes.post("/users/signin", validate(userSchema), loginUser);
userRoutes.post("/users/signup", validate(userSchema), createNewUser);
userRoutes.put("/users/:id/roles", verifyRole("admin"), setRoles);

export default userRoutes;
