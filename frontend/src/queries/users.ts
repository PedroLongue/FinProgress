import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { getData, patchData, postData } from "../services/api";
import type {
  ChangePasswordBody,
  LoginBody,
  LoginUser,
  ProfileUser,
  RegisterBody,
  RegisterUser,
} from "../types/user.type";

type LoginResponse = { user: LoginUser };
type RegisterResponse = { user: RegisterUser };
type MeResponse = { user: ProfileUser };

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
  login: () =>
    mutationOptions({
      mutationKey: ["login"],
      mutationFn: async (body: LoginBody) => {
        const res = await postData<LoginResponse, LoginBody>(
          "/users/login",
          body,
        );
        return res.user;
      },
    }),

  register: () =>
    mutationOptions({
      mutationKey: ["register"],
      mutationFn: async (body: RegisterBody) => {
        const res = await postData<RegisterResponse, RegisterBody>(
          "/users/register",
          body,
        );
        return res.user;
      },
    }),

  changePassword: () =>
    mutationOptions({
      mutationKey: ["change-password"],
      mutationFn: async (body: ChangePasswordBody) => {
        await patchData<void, ChangePasswordBody>(
          "/users/change-password",
          body,
        );
      },
    }),

  logout: () =>
    mutationOptions({
      mutationKey: ["logout"],
      mutationFn: async () => {
        await postData<void, void>("/users/logout");
      },
    }),
};
