import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(5, "A senha deve ter pelo menos 5 caracteres"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "A nova senha e a confirmação devem ser iguais",
    path: ["confirmNewPassword"],
  });
