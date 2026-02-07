import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsMutation } from "../queries/notifications";
import { useSnackbarStore } from "../stores/snackbar.store";
import type { AxiosError } from "axios";

type NotificationsErrorResponse = {
  errors: string[];
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

  return { updateNotificationsSettings };
};
