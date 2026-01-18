import { useQuery } from "@tanstack/react-query";
import { reportsQueries } from "../queries/reports";

export const useSpendingReports = (range = 3) => {
  const {
    data: spendingReport,
    isLoading,
    isError,
  } = useQuery(reportsQueries.getSpendingReport(range));

  return { spendingReport, isLoading, isError };
};
