import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(5, "A senha atual deve ter no mínimo 5 caracteres"),
    newPassword: z
      .string()
      .min(5, "A nova senha deve ter no mínimo 5 caracteres"),
    confirmNewPassword: z
      .string()
      .min(5, "A confirmação da nova senha deve ter no mínimo 5 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "A nova senha e a confirmação devem ser iguais",
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "A nova senha não pode ser igual à senha atual",
  });
