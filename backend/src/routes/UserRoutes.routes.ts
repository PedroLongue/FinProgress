import { Router } from "express";
import {
  forgotPassword,
  getCurrentUser,
  getUserById,
  login,
  logout,
  register,
  resetPassword,
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
import { forgotPasswordLimiter } from "../middlewares/rateLimit.middlewares";

const userRoutes = Router();

userRoutes.post(
  "/register",
  userCreateValidation(),
  handleValidation,
  register,
);

userRoutes.post("/login", loginValidation(), handleValidation, login);

userRoutes.post("/logout", authGuard, logout);

userRoutes.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
userRoutes.post("/reset-password", resetPassword);

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
