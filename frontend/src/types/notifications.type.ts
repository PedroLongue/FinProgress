export type UpdateNotificationsSettingsBody = {
  emailNotificationsEnabled?: boolean;
  notificationsEnabled?: boolean;
  billReminderDays?: number;
};

export type UpdateNotificationsSettingsResponse = {
  emailNotificationsEnabled: boolean;
  notificationsEnabled: boolean;
  billReminderDays: number;
};

export type NotificationsResponse = {
  id: string;
  type: "BILL_EXPIRING";
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};
