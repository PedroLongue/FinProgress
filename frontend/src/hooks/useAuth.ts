import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersMutations, usersQueries } from "../queries/users";
import { useNavigate } from "@tanstack/react-router";

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

  const baseLogin = usersMutations.login(queryClient);
  const loginMutation = useMutation({
    ...baseLogin,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseLogin.onSuccess?.(data, variables, onMutateResult, context);
      navigate({ to: "/", replace: true });
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const baseRegister = usersMutations.register(queryClient);
  const registerMutation = useMutation({
    ...baseRegister,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseRegister.onSuccess?.(data, variables, onMutateResult, context);
      navigate({ to: "/", replace: true });
    },
    onError: (error) => {
      console.error("Register error:", error);
    },
  });

  const baseLogout = usersMutations.logout(queryClient);
  const logoutMutation = useMutation({
    ...baseLogout,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseLogout.onSuccess?.(data, variables, onMutateResult, context);
      navigate({ to: "/login", replace: true });
    },
  });

  return {
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
  };
};
