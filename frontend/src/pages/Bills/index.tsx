import { useState } from "react";
import { BillsList } from "../../components/dashboard/BillsList";
import type { BillsResponse } from "../../queries/bills";
import { useBill } from "../../hooks/useBills";
import { Loading } from "../../components/ui/loading";
import type { BillStatusKey } from "../../types/bills.type";

export const Bills = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    BillStatusKey | "" | "__all__"
  >("");
  const [startDateFilter, setStartDateFilter] = useState<string | undefined>();
  const [endDateFilter, setEndDateFilter] = useState<string | undefined>();

  const statusParam =
    statusFilter === "" || statusFilter === "__all__"
      ? undefined
      : statusFilter;
  const categoryParam =
    categoryFilter === "" || categoryFilter === "__all__"
      ? undefined
      : categoryFilter;

  const { bills, isLoading } = useBill(
    currentPage,
    statusParam,
    categoryParam,
    startDateFilter,
    endDateFilter,
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-24 lg:pb-6">
      <BillsList
        isLoading={isLoading}
        bills={bills as BillsResponse}
        isEmpty={bills?.bills.length === 0}
        onPageChange={setCurrentPage}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onChangeRange={(s, e) => {
          setStartDateFilter(s);
          setEndDateFilter(e);
        }}
      />
    </div>
  );
};
