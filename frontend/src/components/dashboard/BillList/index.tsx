import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import type {
  BillStatusKey,
  Bill,
  CreateBillBody,
} from "../../../types/bills.type";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import type { BillsResponse } from "../../../queries/bills";
import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { BillEditModal } from "../../Modals/BillEditModal";
import { useBillsActions } from "../../../hooks/useBills";
import { BillDeleteModal } from "../../Modals/BillDeleteModal";
import { Link } from "@tanstack/react-router";
import { AppSelect } from "../../ui/app-select";
import { EmptyState } from "../../layout/EmptyState";
import { FilterModal } from "../../Modals/FilterModal";
import type { DateFilterForm } from "../../Modals/FilterModal/validator";
import { BillRow } from "../BillRow";
import { useIsMobile } from "../../../hooks/useMobile";
import { cn } from "../../../lib/utils";
export interface IBillsList {
  bills: BillsResponse;
  isEmpty: boolean;
  dashpage?: boolean;
  onPageChange?: (page: number) => void;

  categoryFilter?: string;
  setCategoryFilter?: Dispatch<SetStateAction<string>>;

  statusFilter?: BillStatusKey | "" | "__all__";
  setStatusFilter?: Dispatch<SetStateAction<BillStatusKey | "" | "__all__">>;

  onChangeRange?: (start?: string, end?: string) => void;

  isLoading?: boolean;
}

export const BillsList = ({
  bills,
  isEmpty,
  onPageChange,
  dashpage = false,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  onChangeRange,
  isLoading = false,
}: IBillsList) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const [currentPage, setCurrentPage] = useState(() => bills?.page ?? 1);
  const totalPages = bills?.totalPages ?? 1;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { updateBill, deleteBill } = useBillsActions();
  const isMobile = useIsMobile();

  const userCategories = useMemo(() => {
    const fromApi = bills?.userCategories;
    return Array.isArray(fromApi) && fromApi.length ? fromApi : undefined;
  }, [bills]);

  const categoryOptions = useMemo(
    () => userCategories?.map((cat) => ({ value: cat, label: cat })) ?? [],
    [userCategories],
  );

  const statusOptions = useMemo(
    () => [
      { value: "PENDING", label: "Pendente" },
      { value: "PAID", label: "Pago" },
      { value: "PAID_LATE", label: "Pago com atraso" },
      { value: "OVERDUE", label: "Vencido" },
    ],
    [],
  );

  const closeAllModals = useCallback(() => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsFilterModalOpen(false);
    setSelectedBill(null);
  }, []);

  const openEdit = useCallback((bill: Bill) => {
    setSelectedBill(bill);
    setIsEditModalOpen(true);
  }, []);

  const openDelete = useCallback((bill: Bill) => {
    setSelectedBill(bill);
    setIsDeleteModalOpen(true);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    },
    [onPageChange, totalPages],
  );

  const handleBillSave = useCallback(
    async (updatedBill: Partial<CreateBillBody>) => {
      if (!selectedBill?.id) return;
      await updateBill.mutateAsync({ id: selectedBill.id, body: updatedBill });
      closeAllModals();
    },
    [closeAllModals, selectedBill, updateBill],
  );

  const handleDeleteBill = useCallback(async () => {
    if (!selectedBill?.id) return;
    await deleteBill.mutateAsync(selectedBill.id);
    closeAllModals();
  }, [closeAllModals, deleteBill, selectedBill]);

  const handleApply = useCallback(
    (data: DateFilterForm) => {
      onChangeRange?.(data.startDate || undefined, data.endDate || undefined);
      setIsFilterModalOpen(false);
    },
    [onChangeRange],
  );

  return (
    <Card variant="default">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle
            className={cn(
              "flex items-center gap-2",
              isMobile ? "text-base" : "text-lg",
            )}
          >
            <Calendar className="w-5 h-5 text-primary" />
            {dashpage ? "Próximos Boletos não pagos" : "Boletos"}
          </CardTitle>

          {!isEmpty && dashpage && (
            <Button variant="ghost" size="sm" className="text-primary" asChild>
              <Link to="/bills">
                {!isMobile && "Ver todos"} <ArrowRight />
              </Link>
            </Button>
          )}

          {!dashpage && !isEmpty && (
            <div
              className={cn(
                isMobile
                  ? "flex flex-col gap-2 items-end"
                  : "md:flex items-center gap-2",
              )}
            >
              <AppSelect
                value={categoryFilter ?? ""}
                onChange={(v) => {
                  setCategoryFilter?.(v as string);
                  onPageChange?.(1);
                }}
                placeholder="Todas as categorias"
                ariaLabel="Filtrar por categoria"
                dataTestId="category-filter-select"
                options={categoryOptions}
              />

              <AppSelect
                value={statusFilter ?? ""}
                onChange={(v) => {
                  setStatusFilter?.(v as BillStatusKey | "");
                  onPageChange?.(1);
                }}
                placeholder="Todos os status"
                ariaLabel="Filtrar por status"
                dataTestId="status-filter-select"
                options={statusOptions}
              />

              <Button
                onClick={() => setIsFilterModalOpen(true)}
                data-testid="open-date-filter-button"
              >
                <Calendar className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isEmpty ? (
          <EmptyState type="billList" emptyBillListFilter={userCategories} />
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Para editar o boleto ou marcar como pago, basta clicar nele.
            </p>
            <div className="space-y-3">
              {bills?.bills?.map((bill, index) => (
                <BillRow
                  key={bill.id}
                  bill={bill}
                  index={index}
                  onEdit={openEdit}
                  onDelete={openDelete}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-2"
                  data-testid="previous-page-button"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-2"
                  data-testid="next-page-button"
                >
                  Próxima
                  <ChevronRight className="h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>

      {selectedBill && isEditModalOpen && (
        <BillEditModal
          bill={selectedBill}
          onClose={closeAllModals}
          onSave={(updated) => handleBillSave(updated as CreateBillBody)}
          isLoading={updateBill.isPending}
          isEditing={true}
        />
      )}

      {selectedBill && isDeleteModalOpen && (
        <BillDeleteModal
          bill={selectedBill}
          onClose={closeAllModals}
          isLoading={deleteBill.isPending}
          onDelete={handleDeleteBill}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal
          onClose={() => setIsFilterModalOpen(false)}
          OnAplly={(data: DateFilterForm) => handleApply(data)}
          isLoading={isLoading}
        />
      )}
    </Card>
  );
};
