import { z } from "zod";

export const billSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Informe um título de no mínimo 2 caracteres")
    .max(50, "Limite de 50 caracteres"),
  amount: z
    .string()
    .min(1, "Informe o valor")
    .transform((val) => {
      const normalized = val.replace(",", ".");
      const num = parseFloat(normalized);
      return isNaN(num) ? 0 : num;
    })
    .refine((val) => val > 0, "Informe um valor maior que zero")
    .refine((val) => !isNaN(val), "Valor inválido"),
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
