import type { QueryClient } from "@tanstack/react-query";
import { mutationOptions } from "@tanstack/react-query";
import { patchData } from "../services/api";
import type {
  UpdateNotificationsSettingsBody,
  UpdateNotificationsSettingsResponse,
} from "../types/notifications.type";

export const notificationsMutation = {
  updateSettings: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: ["update-notifications-settings"],
      mutationFn: async (body: UpdateNotificationsSettingsBody) => {
        const res = await patchData<
          UpdateNotificationsSettingsResponse,
          UpdateNotificationsSettingsBody
        >("/notifications/settings", body);

        return res.settings;
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["me"] });
      },
    }),
};
