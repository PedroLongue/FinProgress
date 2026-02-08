import { Router } from "express";
import {
  sendExpiringBillsEmails,
  updateNotificationsSettings,
  subscribePush,
  unsubscribePush,
  getNotificationsCount,
  listNotifications,
  markNotificationRead,
} from "../controllers/notifications.controller";
import { authGuard } from "../middlewares/authGuard.middlewares";

export const notificationsRoutes = Router();

notificationsRoutes.post("/expiring-bills", sendExpiringBillsEmails);
notificationsRoutes.patch("/settings", authGuard, updateNotificationsSettings);

notificationsRoutes.post("/push/subscribe", authGuard, subscribePush);
notificationsRoutes.post("/push/unsubscribe", authGuard, unsubscribePush);

notificationsRoutes.get("/push/count", authGuard, getNotificationsCount);
notificationsRoutes.get("/push", authGuard, listNotifications);
notificationsRoutes.patch("/push/:id/read", authGuard, markNotificationRead);
