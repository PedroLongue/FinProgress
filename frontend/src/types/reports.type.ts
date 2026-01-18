export interface ISpendingReportData {
  rangeMonths: 3 | 6 | 12;
  currentMonth: { month: string; total: number; count: number };
  totals: { totalInRange: number; monthsCount: number };
  byMonth: { month: string; total: number; count: number }[];
}

type RangeType = {
  start: string;
  end: string;
};

type CategoryTotalType = {
  totalInRange: number;
  categoriesCount: number;
};

type CategoriesType = {
  category: string;
  total: number;
  count: number;
};
export interface ISpendingByCategoryReportData {
  range: RangeType;
  totals: CategoryTotalType;
  byCategory: CategoriesType[];
}
