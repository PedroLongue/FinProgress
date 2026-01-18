export interface ISpendingReportData {
  rangeMonths: 3 | 6 | 12;
  currentMonth: { month: string; total: number; count: number };
  totals: { totalInRange: number; monthsCount: number };
  byMonth: { month: string; total: number; count: number }[];
}

type RangeType = {
  start: Date;
  end: Date;
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
  total: CategoryTotalType;
  byCategory: CategoriesType[];
}
