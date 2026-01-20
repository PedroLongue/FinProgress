import { z } from "zod";

export const dateFilterSchema = z.object({
  startDate: z.string().min(1, "Informe a data inicial"),
  endDate: z.string().min(1, "Informe a data final"),
});

export type DateFilterForm = z.infer<typeof dateFilterSchema>;
