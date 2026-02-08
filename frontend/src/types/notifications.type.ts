export type UpdateNotificationsSettingsBody = {
  emailNotificationsEnabled?: boolean;
  pushNotificationsEnabled?: boolean;
  billReminderDays?: number;
};

export type UpdateNotificationsSettingsResponse = {
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  billReminderDays: number;
};

export type NotificationsResponse = {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};
