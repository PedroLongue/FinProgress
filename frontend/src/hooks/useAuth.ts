import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersMutations, usersQueries } from "../queries/users";
import { useNavigate } from "@tanstack/react-router";
import { useSnackbarStore } from "../stores/snackbar.store";
import type { AxiosError } from "axios";

type AuthErrorResponse = {
  errors: string[];
};

export const useAuth = () => {
  const { data: user, isLoading, isError } = useQuery(usersQueries.me());

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isError,
  };
};

export const useAuthActions = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const showSnackbar = useSnackbarStore((s) => s.show);
  const baseLogin = usersMutations.login();
  const loginMutation = useMutation({
    ...baseLogin,
    onSuccess: (user) => {
      queryClient.setQueryData(["me"], user);
      navigate({ to: "/", replace: true });
    },
    onError: (error: AxiosError<AuthErrorResponse>) => {
      showSnackbar({
        severity: "error",
        message: error.response?.data.errors[0] ?? "Erro ao fazer login.",
      });
    },
  });

  const baseRegister = usersMutations.register();
  const registerMutation = useMutation({
    ...baseRegister,
    onSuccess: (user) => {
      queryClient.setQueryData(["me"], user);
      navigate({ to: "/", replace: true });
    },
    onError: (error: AxiosError<AuthErrorResponse>) => {
      showSnackbar({
        severity: "error",
        message: error.response?.data.errors[0] ?? "Erro ao fazer registro.",
      });
    },
  });

  const baseChangePassword = usersMutations.changePassword();
  const changePasswordMutation = useMutation({
    ...baseChangePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      showSnackbar({
        severity: "success",
        message: "Senha alterada com sucesso.",
      });
    },
    onError: (error: AxiosError<AuthErrorResponse>) => {
      showSnackbar({
        severity: "error",
        message: error.response?.data.errors[0] ?? "Erro ao alterar a senha.",
      });
    },
  });

  const baseSendResetPasswordEmail = usersMutations.sendResetPasswordEmail();
  const sendResetPasswordEmailMutation = useMutation({
    ...baseSendResetPasswordEmail,
    onSuccess: () => {
      showSnackbar({
        severity: "success",
        message: "Email de redefinição de senha enviado com sucesso.",
      });
    },
    onError: (error: AxiosError<AuthErrorResponse>) => {
      showSnackbar({
        severity: "error",
        message:
          error.response?.data.errors[0] ??
          "Erro ao enviar o email de redefinição de senha.",
      });
    },
  });

  const baseResetPassword = usersMutations.resetPassword();
  const resetPasswordMutation = useMutation({
    ...baseResetPassword,
    onSuccess: () => {
      showSnackbar({
        severity: "success",
        message: "Senha redefinida com sucesso.",
      });

      navigate({ to: "/login", replace: true });
    },
    onError: (error: AxiosError<AuthErrorResponse>) => {
      showSnackbar({
        severity: "error",
        message: error.response?.data.errors[0] ?? "Erro ao redefinir a senha.",
      });
    },
  });

  const baseLogout = usersMutations.logout();
  const logoutMutation = useMutation({
    ...baseLogout,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["bill-details"] });
      queryClient.invalidateQueries({ queryKey: ["bill-score-explanation"] });
      queryClient.invalidateQueries({ queryKey: ["spending-report"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-goal"] });
      queryClient.invalidateQueries({
        queryKey: ["spending-report-by-category"],
      });
      queryClient.invalidateQueries({
        queryKey: ["spending-report-by-category"],
      });
      queryClient.invalidateQueries({
        queryKey: ["update-notifications-settings"],
      });
      navigate({ to: "/login", replace: true });
    },
  });

  return {
    login: loginMutation,
    register: registerMutation,
    changePassword: changePasswordMutation,
    sendResetPasswordEmail: sendResetPasswordEmailMutation,
    resetPassword: resetPasswordMutation,
    logout: logoutMutation,
  };
};
