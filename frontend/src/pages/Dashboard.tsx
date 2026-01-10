import { useState } from "react";
import { BillsList } from "../components/dashboard/BillsList";
import { HealthScoreCard } from "../components/dashboard/HealthScoreCard";
import { Loading } from "../components/ui/loading";
import { useAuth } from "../hooks/useAuth";
import { useBill, useBillDetails } from "../hooks/useBills";
import type { BillsResponse } from "../queries/bills";

export const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const { bills, isLoading } = useBill(currentPage, "UNPAID");
  const { billDatils } = useBillDetails();

  if (isLoading) {
    return <Loading />;
  }

  const isScoreEmpty =
    billDatils?.totalBills === 0 && billDatils?.totalPending === 0;

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {user?.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Aqui está o resumo das suas finanças
        </p>
      </div>
      <HealthScoreCard
        score={billDatils ? billDatils?.score : 0}
        isEmpty={isScoreEmpty}
        onAction={() => console.log()}
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
