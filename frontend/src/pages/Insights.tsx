import { useState } from "react";
import { SpendingReports } from "../components/reports/spending";
import { useReports } from "../hooks/useReports";
import { Loading } from "../components/ui/loading";
import type { ISpendingReportData } from "../types/reports.type";

export const Insights = () => {
  const [monthFilter, setMonthFilter] = useState<3 | 6 | 12>(3);

  const { spendingReport, isLoading } = useReports(monthFilter);

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-24 lg:pb-6">
      <h1 className="text-2xl font-bold">Insights</h1>
      <SpendingReports
        spendingReportData={spendingReport as ISpendingReportData}
        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}
      />
    </div>
  );
};
