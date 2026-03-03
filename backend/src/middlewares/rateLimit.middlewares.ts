import rateLimit from "express-rate-limit";

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errors: ["Muitas tentativas. Tente novamente mais tarde."],
  },
});
