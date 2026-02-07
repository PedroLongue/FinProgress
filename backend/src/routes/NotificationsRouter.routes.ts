import { Router } from "express";
import { sendExpiringBillsEmails } from "../controllers/expiringBills.controller";

export const notificationsRoutes = Router();

notificationsRoutes.post("/expiring-bills", sendExpiringBillsEmails);
