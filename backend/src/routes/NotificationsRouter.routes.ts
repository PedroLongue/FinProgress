import { Router } from "express";
import {
  sendExpiringBillsEmails,
  updateNotificationsSettings,
} from "../controllers/notifications.controller";
import { authGuard } from "../middlewares/authGuard.middlewares";

export const notificationsRoutes = Router();

notificationsRoutes.post("/expiring-bills", sendExpiringBillsEmails);
notificationsRoutes.patch("/settings", authGuard, updateNotificationsSettings);
