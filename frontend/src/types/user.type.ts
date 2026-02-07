import type { UpdateNotificationsSettingsResponse } from "./notifications.type";

export type LoginUser = UpdateNotificationsSettingsResponse & {
  id: string;
  name: string;
  email: string;
};

export type RegisterUser = LoginUser & {
  createdAt: string;
  isActive: boolean;
};

export type ProfileUser = RegisterUser & {
  phone: string | null;
  billReminderDays: number;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
};

export type LoginBody = { email: string; password: string };

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type UpdatePhoneBody = { phone: string | null };

export type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
