import { Request, Response, Router } from "express";
import userRoutes from "./UserRoutes.routes";
import billRoutes from "./BillRoutes.routes";
import reportsRoutes from "./ReportsRouter.routes";
import monthlyGoal from "./monthlyGoal.routes";
import { notificationsRoutes } from "./NotificationsRouter.routes";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.send("API is running");
});

router.use("/api/users", userRoutes);
router.use("/api/bills", billRoutes);
router.use("/api/reports", reportsRoutes);
router.use("/api/monthly-goal", monthlyGoal);
router.use("/api/notifications", notificationsRoutes);

export default router;
