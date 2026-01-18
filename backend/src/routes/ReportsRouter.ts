import { Router } from "express";
import { authGuard } from "../middlewares/authGuard.middlewares";
import {
  getSpendingByCategoryReport,
  getSpendingReport,
} from "../controllers/reports.controller";

const reportsRoutes = Router();

reportsRoutes.use(authGuard);

reportsRoutes.get("/spending", getSpendingReport);

reportsRoutes.get("/spending-by-category", getSpendingByCategoryReport);

export default reportsRoutes;
