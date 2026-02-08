import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  notificationsMutation,
  notificationsQuery,
} from "../queries/notifications";
import { useSnackbarStore } from "../stores/snackbar.store";
import type { AxiosError } from "axios";

type NotificationsErrorResponse = {
  errors: string[];
};

export const useNotificationsList = () => {
  const {
    data: pushNotifications,
    isLoading,
    isError,
    refetch,
  } = useQuery(notificationsQuery.listNotifications());

  return {
    pushNotifications,
    isLoading,
    isError,
    refetchNotifications: refetch,
  };
};

export const useNotificationsCount = () => {
  const {
    data: notificationsCount,
    isLoading,
    isError,
  } = useQuery(notificationsQuery.getNotificationsCount());

  return {
    notificationsCount,
    isLoading,
    isError,
  };
};

export const useNotificationsActions = () => {
  const showSnackbar = useSnackbarStore((s) => s.show);
  const queryClient = useQueryClient();

  const baseUpdateNotificationsSettings =
    notificationsMutation.updateSettings();

  const updateNotificationsSettings = useMutation({
    ...baseUpdateNotificationsSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      showSnackbar({
        message: "Configurações de notificações atualizadas com sucesso!",
        severity: "success",
      });
    },
    onError: (error: AxiosError<NotificationsErrorResponse>) => {
      showSnackbar({
        message:
          error.response?.data.errors[0] ||
          "Erro ao atualizar configurações de notificações.",
        severity: "error",
      });
    },
  });

  const markNotificationReadBase = notificationsMutation.markNotificationRead();
  const markNotificationRead = useMutation({
    ...markNotificationReadBase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
    onError: (error: AxiosError<NotificationsErrorResponse>) => {
      showSnackbar({
        message:
          error.response?.data?.errors?.[0] ??
          "Erro ao marcar notificação como lida.",
        severity: "error",
      });
    },
  });

  return { updateNotificationsSettings, markNotificationRead };
};
