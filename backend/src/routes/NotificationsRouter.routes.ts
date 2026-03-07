import { Router } from "express";
import {
  sendExpiringBillsEmails,
  updateNotificationsSettings,
  getNotificationsCount,
  listNotifications,
  markNotificationRead,
  telegramWebhook,
} from "../controllers/notifications.controller";
import { authGuard } from "../middlewares/authGuard.middlewares";

export const notificationsRoutes = Router();

notificationsRoutes.post("/expiring-bills", sendExpiringBillsEmails);
notificationsRoutes.patch("/settings", authGuard, updateNotificationsSettings);

notificationsRoutes.post("/telegram/webhook", telegramWebhook);

notificationsRoutes.get("/count", authGuard, getNotificationsCount);
notificationsRoutes.get("/", authGuard, listNotifications);
notificationsRoutes.patch("/:id/read", authGuard, markNotificationRead);
