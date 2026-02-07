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
