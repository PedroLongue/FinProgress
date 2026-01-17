import { Router } from "express";
import {
  getMonthlyGoalSummary,
  upsertMonthlyGoal,
} from "../controllers/monthlyGoal.controller";
import { authGuard } from "../middlewares/authGuard.middlewares";

const goalRouter = Router();

goalRouter.use(authGuard);

goalRouter.get("/", getMonthlyGoalSummary);
goalRouter.post("/", upsertMonthlyGoal);

export default goalRouter;
