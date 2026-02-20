import type { NotificationsResponse } from "../types/notifications.type";

export const notificationsMock: NotificationsResponse[] = [
  {
    id: "1",
    title: "Notificação 1",
    body: "Corpo da notificação 1",
    isRead: false,
    createdAt: new Date().toISOString(),
    type: "BILL_EXPIRING",
  },
  {
    id: "2",
    title: "Notificação 2",
    body: "Corpo da notificação 2",
    isRead: false,
    createdAt: new Date().toISOString(),
    type: "BILL_EXPIRING",
  },
];
