export interface ILoginUser {
  id: string;
  name: string;
  email: string;
}

export interface IRegisterUser extends ILoginUser {
  createdAt: string;
  isActive: boolean;
}

export interface IProfileUser extends IRegisterUser {
  phone: string | null;
}

export type LoginBody = { email: string; password: string };

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
