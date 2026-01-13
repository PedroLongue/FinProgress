export interface ISpendingReportData {
  rangeMonths: 3 | 6 | 12;
  currentMonth: { month: string; total: number; count: number };
  totals: { totalInRange: number; monthsCount: number };
  byMonth: { month: string; total: number; count: number }[];
}
