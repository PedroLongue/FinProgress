import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/authCookie.utils";

interface AuthRequest extends Request {
  userId?: string;
}

export const authGuard = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error("JWT_SECRET não definido no .env");

  const token = req.cookies?.[COOKIE_NAME];

  if (!token) return res.status(401).json({ errors: ["Token ausente"] });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id?: string };
    if (!payload.id)
      return res.status(401).json({ errors: ["Token inválido"] });

    req.userId = payload.id;
    return next();
  } catch {
    return res.status(401).json({ errors: ["Token inválido"] });
  }
};
