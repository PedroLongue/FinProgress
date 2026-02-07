import { Router } from "express";
import {
  getCurrentUser,
  getUserById,
  login,
  logout,
  register,
  updateUserPassword,
  updateUserPhone,
} from "../controllers/auth.controller";
import {
  loginValidation,
  passwordChangeValidation,
  phoneValidation,
  userCreateValidation,
} from "../middlewares/userValidation.middlewares";
import { handleValidation } from "../middlewares/handleValidation.middlewares";
import { authGuard } from "../middlewares/authGuard.middlewares";

const userRoutes = Router();

userRoutes.post(
  "/register",
  userCreateValidation(),
  handleValidation,
  register,
);

userRoutes.post("/login", loginValidation(), handleValidation, login);

userRoutes.post("/logout", authGuard, logout);

userRoutes.get("/profile", authGuard, getCurrentUser);

userRoutes.patch(
  "/profile",
  authGuard,
  phoneValidation(),
  handleValidation,
  updateUserPhone,
);

userRoutes.patch(
  "/change-password",
  authGuard,
  passwordChangeValidation(),
  handleValidation,
  updateUserPassword,
);

userRoutes.get("/:id", getUserById);

export default userRoutes;
