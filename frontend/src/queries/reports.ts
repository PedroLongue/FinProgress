import { getData } from "../services/api";
import type {
  ISpendingByCategoryReportData,
  ISpendingReportData,
} from "../types/reports.type";

export const reportsQueries = {
  getSpendingReport: (range?: number) => ({
    queryKey: ["spending-report", { range: range ?? null }],
    queryFn: () => {
      return getData<ISpendingReportData>(`/reports/spending?range=${range}`);
    },
  }),

  getSpendingByCategoryReport: (start?: string, end?: string) => {
    const params = new URLSearchParams();
    if (start) params.set("start", start);
    if (end) params.set("end", end);

    const qs = params.toString();
    const url = qs
      ? `/reports/spending-by-category?${qs}`
      : `/reports/spending-by-category`;

    return {
      queryKey: [
        "spending-report-by-category",
        { start: start ?? null, end: end ?? null },
      ],
      queryFn: () => getData<ISpendingByCategoryReportData>(url),
    };
  },
};
