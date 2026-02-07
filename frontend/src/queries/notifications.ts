import { mutationOptions } from "@tanstack/react-query";
import { patchData } from "../services/api";
import type {
  UpdateNotificationsSettingsBody,
  UpdateNotificationsSettingsResponse,
} from "../types/notifications.type";

export const notificationsMutation = {
  updateSettings: () =>
    mutationOptions({
      mutationKey: ["update-notifications-settings"],
      mutationFn: async (body: UpdateNotificationsSettingsBody) => {
        return await patchData<
          UpdateNotificationsSettingsResponse,
          UpdateNotificationsSettingsBody
        >("/notifications/settings", body);
      },
    }),
};
