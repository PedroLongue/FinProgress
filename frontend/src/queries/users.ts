import type { QueryClient } from "@tanstack/react-query";
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { getData, postData } from "../services/api";
import type {
  ILoginUser,
  IProfileUser,
  IRegisterUser,
  LoginBody,
  RegisterBody,
} from "../types/user.type";

type LoginResponse = { user: ILoginUser };
type RegisterResponse = { user: IRegisterUser };
type MeResponse = { user: IProfileUser };

export const usersQueries = {
  me: () =>
    queryOptions({
      queryKey: ["me"],
      queryFn: async () => {
        const res = await getData<MeResponse>("/users/profile");
        return res.user;
      },
      retry: false,
    }),
};

export const usersMutations = {
  login: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: ["login"],
      mutationFn: async (body: LoginBody) => {
        const res = await postData<LoginResponse, LoginBody>(
          "/users/login",
          body
        );
        return res.user;
      },
      onSuccess: (user) => {
        qc.setQueryData(["me"], user);
      },
    }),

  register: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: ["register"],
      mutationFn: async (body: RegisterBody) => {
        const res = await postData<RegisterResponse, RegisterBody>(
          "/users/register",
          body
        );
        return res.user;
      },
      onSuccess: (user) => {
        qc.setQueryData(["me"], user);
      },
    }),

  logout: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: ["logout"],
      mutationFn: async () => {
        await postData<void, void>("/users/logout");
      },
      onSuccess: () => {
        qc.setQueryData(["me"], null);
        qc.removeQueries({ queryKey: ["me"] });
      },
    }),
};
