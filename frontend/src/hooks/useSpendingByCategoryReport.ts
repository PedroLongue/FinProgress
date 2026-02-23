import { useQuery } from "@tanstack/react-query";
import { reportsQueries } from "../queries/reports";

export const useSpendingByCategoryReport = (start?: string, end?: string) => {
  const { data, isLoading, isError } = useQuery(
    reportsQueries.getSpendingByCategoryReport(start, end),
  );

  return { spendingByCategoryReport: data, isLoading, isError };
};
