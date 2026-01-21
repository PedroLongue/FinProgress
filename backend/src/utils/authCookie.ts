import type { Response } from "express";

export const COOKIE_NAME = "access_token";

export const setAuthCookie = (res: Response, token: string) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd, // dev: false, prod: true (https)
    sameSite: isProd ? "none" : "lax",
    maxAge: 4 * 24 * 60 * 60 * 1000, // 4 dias
    path: "/",
  });
};

export const clearAuthCookie = (res: Response) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
};
