import { getData } from "../services/api";
import type { ISpendingReportData } from "../types/reports.type";

export const reportsQueries = {
  getSpendingReport: (range?: number) => ({
    queryKey: ["spending-report", { range: range ?? null }],
    queryFn: () => {
      return getData<ISpendingReportData>(`/reports/spending?range=${range}`);
    },
  }),
};
