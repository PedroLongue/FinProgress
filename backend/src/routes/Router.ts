import { Request, Response, Router } from "express";
import userRoutes from "./UserRoutes";
import billRoutes from "./BillRoutes";
import reportsRoutes from "./ReportsRouter";

const router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.send("API is running");
});

router.use("/api/users", userRoutes);
router.use("/api/bills", billRoutes);
router.use("/api/reports", reportsRoutes);

export default router;
