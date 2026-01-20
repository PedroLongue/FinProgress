import { z } from "zod";

export const goalSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, "Valor da meta deve ser maior ou igual a 1")
    .positive("Valor deve ser positivo"),
});
