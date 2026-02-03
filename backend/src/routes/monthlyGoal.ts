import { Router } from "express";
import {
  getMonthlyGoalHistory,
  getMonthlyGoalSummary,
  upsertMonthlyGoal,
} from "../controllers/monthlyGoal.controller";
import { authGuard } from "../middlewares/authGuard.middlewares";

const goalRouter = Router();

goalRouter.use(authGuard);

goalRouter.get("/", getMonthlyGoalSummary);
goalRouter.post("/", upsertMonthlyGoal);
goalRouter.get("/history", getMonthlyGoalHistory);

export default goalRouter;
