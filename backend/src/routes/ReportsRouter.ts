import { Router } from "express";
import { authGuard } from "../middlewares/authGuard.middlewares";
import { getSpendingReport } from "../controllers/reports.controller";

const reportsRoutes = Router();

reportsRoutes.use(authGuard);

reportsRoutes.get("/spending", getSpendingReport);

export default reportsRoutes;
