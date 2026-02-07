import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const handleValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(422).json({
      errors: result.array().map((e) => e.msg),
    });
  }

  return next();
};
