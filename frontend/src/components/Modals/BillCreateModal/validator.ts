import { z } from "zod";

export const billSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Informe um título de no mínimo 2 caracteres")
    .max(50, "Limite de 50 caracteres"),
  amount: z
    .number({ message: "Informe o valor" })
    .refine((v) => Number.isFinite(v), "Informe o valor")
    .refine((v) => v > 0, "Informe um valor maior que zero"),
  dueDate: z
    .string()
    .min(1, "Informe o vencimento")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  barcode: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined))
    .refine(
      (v) => !v || /^\d+$/.test(v),
      "Código de barras deve ter apenas dígitos",
    ),
  description: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
});

export type BillFormValues = z.infer<typeof billSchema>;
