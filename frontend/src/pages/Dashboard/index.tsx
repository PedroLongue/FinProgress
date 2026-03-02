import { useState } from "react";
import { BillsList } from "../../components/dashboard/BillList";
import { HealthScoreCard } from "../../components/dashboard/HealthScoreCard";
import { Loading } from "../../components/ui/loading";
import { useAuth } from "../../hooks/useAuth";
import { useBill, useBillDetails } from "../../hooks/useBills";
import type { BillsResponse } from "../../queries/bills";

export const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const { bills, isLoading } = useBill(currentPage, "UNPAID");
  const { billDetails, isLoading: isDetailsLoading } = useBillDetails();

  if (isLoading) {
    return <Loading />;
  }

  const isScoreEmpty =
    billDetails?.totalBills === 0 && billDetails?.totalPending === 0;

  return (
    <div
      className="lg:p-6 space-y-6 pb-24 lg:pb-6"
      data-testid="dashboard-page"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {user?.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Aqui está o resumo das suas finanças
        </p>
      </div>
      <HealthScoreCard
        score={billDetails ? billDetails?.score : 0}
        isEmpty={isScoreEmpty}
        isLoading={isDetailsLoading}
      />
      <BillsList
        dashpage
        bills={bills as BillsResponse}
        isEmpty={bills?.bills.length === 0}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
