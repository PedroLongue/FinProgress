export type UpdateNotificationsSettingsBody = {
  emailNotificationsEnabled?: boolean;
  pushNotificationsEnabled?: boolean;
  billReminderDays?: number;
};

export type UpdateNotificationsSettingsResponse = {
  settings: {
    emailNotificationsEnabled: boolean;
    pushNotificationsEnabled: boolean;
    billReminderDays: number;
  };
};
