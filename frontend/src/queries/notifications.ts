import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getData, patchData } from "../services/api";
import type {
  NotificationsResponse,
  UpdateNotificationsSettingsBody,
  UpdateNotificationsSettingsResponse,
} from "../types/notifications.type";

export const notificationsQuery = {
  getNotificationsCount: () =>
    queryOptions({
      queryKey: ["notifications-count"],
      queryFn: async () => {
        return await getData<{ unread: number }>("/notifications/push/count");
      },

      // pooling a cada 60 segundos para manter o número de notificações atualizado
      refetchInterval: 60_000,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      staleTime: 30_000,
    }),

  listNotifications: () =>
    queryOptions({
      queryKey: ["notifications"],
      queryFn: async () => {
        return await getData<NotificationsResponse[]>(
          "/notifications/push?take=20",
        );
      },
    }),
};

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

  markNotificationRead: () =>
    mutationOptions({
      mutationKey: ["mark-notification-read"],
      mutationFn: async (id: string) => {
        return await patchData(`/notifications/push/${id}/read`);
      },
    }),
};
