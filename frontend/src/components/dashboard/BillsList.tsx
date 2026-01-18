import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import type {
  BillStatusKey,
  IBill,
  ICreateBillBody,
} from "../../types/bills.type";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import type { BillsResponse } from "../../queries/bills";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { BillEditModal } from "../Modals/BillEditModal";
import {
  formatCurrency,
  formatDate,
  getStatusIcon,
  getStatusStyles,
  isOverdue,
  isPaid,
} from "../../utils/bills.utils";
import { useBillsActions } from "../../hooks/useBills";
import { BillDeleteModal } from "../Modals/BillDeleteModal";
import { Link } from "@tanstack/react-router";
import { useSnackbarStore } from "../../stores/snackbar.store";
import { AppSelect } from "../ui/app-select";
import { EmptyState } from "../layout/EmptyState";
interface IBillsList {
  bills: BillsResponse;
  isEmpty: boolean;
  dashpage?: boolean;
  onPageChange?: (page: number) => void;

  categoryFilter?: string;
  setCategoryFilter?: Dispatch<SetStateAction<string>>;

  statusFilter?: BillStatusKey | "" | "__all__";
  setStatusFilter?: Dispatch<SetStateAction<BillStatusKey | "" | "__all__">>;
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
}: IBillsList) => {
  const { updateBill, deleteBill } = useBillsActions();

  const [currentPage, setCurrentPage] = useState(() => bills?.page ?? 1);
  const totalPages = bills?.totalPages ?? 1;

  const showSnackbar = useSnackbarStore((s) => s.show);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedBill, setSelectedBill] = useState<IBill | null>(null);

  const userCategories = useMemo(() => {
    const fromApi = bills?.userCategories;
    if (Array.isArray(fromApi) && fromApi.length) return fromApi;
  }, [bills]);

  const categoryOptions =
    userCategories?.map((cat) => ({ value: cat, label: cat })) ?? [];

  const statusOptions = [
    { value: "PENDING", label: "Pendente" },
    { value: "PAID", label: "Pago" },
    { value: "PAID_LATE", label: "Pago com atraso" },
    { value: "OVERDUE", label: "Vencido" },
  ];

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const handleBillSave = async (updatedBill: Partial<ICreateBillBody>) => {
    if (!selectedBill?.id) return;
    await updateBill.mutateAsync({ id: selectedBill.id, body: updatedBill });
    handleCloseModal();
  };

  const handleBillClick = (bill: IBill) => {
    setSelectedBill(bill);
    setIsEditModalOpen(true);
  };

  const handleDeleteBillClick = (bill: IBill) => {
    setSelectedBill(bill);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedBill(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteBill = async (bill: IBill) => {
    if (!selectedBill?.id) return;
    await deleteBill.mutateAsync(bill.id);
    handleCloseModal();
  };

  useEffect(() => {
    if (isEditModalOpen) return;
    if (updateBill.isSuccess)
      showSnackbar({
        severity: "success",
        message: "Boleto editado com sucesso.",
      });
    if (updateBill.isError)
      showSnackbar({
        severity: "error",
        message: "Erro ao editar boleto, tente novamente.",
      });
  }, [isEditModalOpen, updateBill.isError, updateBill.isSuccess, showSnackbar]);

  useEffect(() => {
    if (isDeleteModalOpen) return;
    if (deleteBill.isSuccess)
      showSnackbar({
        severity: "warning",
        message: "Boleto excluído com sucesso.",
      });
    if (deleteBill.isError)
      showSnackbar({
        severity: "error",
        message: "Erro ao excluir boleto, tente novamente.",
      });
  }, [
    isDeleteModalOpen,
    deleteBill.isError,
    deleteBill.isSuccess,
    showSnackbar,
  ]);

  return (
    <Card variant="default">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {dashpage ? "Próximos Boletos não pagos" : "Boletos"}
          </CardTitle>
          {!isEmpty && dashpage && (
            <Button variant="ghost" size="sm" className="text-primary" asChild>
              <Link to="/bills">
                Ver todos <ArrowRight />
              </Link>
            </Button>
          )}
          {!dashpage && (
            <div className="hidden md:flex items-center gap-2">
              <AppSelect
                value={categoryFilter ?? ""}
                onChange={(v) => {
                  setCategoryFilter?.(v as string);
                  onPageChange?.(1);
                }}
                placeholder="Todas as categorias"
                ariaLabel="Filtrar por categoria"
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
                options={statusOptions}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isEmpty ? (
          <EmptyState type="billList" emptyBillListFilter={userCategories} />
        ) : (
          <>
            <div className="space-y-3">
              {bills?.bills &&
                bills.bills.map((bill, index) => (
                  <div
                    key={bill.id}
                    onClick={() => handleBillClick(bill)}
                    className={cn(
                      "group flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-all duration-200 animate-slide-up",
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center border shrink-0",
                        getStatusStyles(bill.status),
                      )}
                    >
                      {getStatusIcon(bill.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">
                          {bill.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="category">{bill.category}</Badge>
                        <span
                          className={cn(
                            "text-xs",
                            isOverdue(bill.status)
                              ? "text-destructive font-medium"
                              : "text-muted-foreground",
                          )}
                        >
                          {formatDate(bill.dueDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 text-center px-4">
                      <span className="text-left text-sm text-muted-foreground line-clamp-1">
                        {bill.description || "Sem descrição"}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={cn(
                          "font-semibold",
                          isPaid(bill.status)
                            ? "text-success"
                            : isOverdue(bill.status)
                              ? "text-destructive"
                              : "text-foreground",
                        )}
                      >
                        {formatCurrency(bill.amount)}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 transition-opacity shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBillClick(bill);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      {selectedBill && isEditModalOpen && (
        <BillEditModal
          bill={selectedBill}
          onClose={handleCloseModal}
          onSave={(updated) => handleBillSave(updated as ICreateBillBody)}
          isLoading={updateBill.isPending}
          isEditing={true}
        />
      )}
      {selectedBill && isDeleteModalOpen && (
        <BillDeleteModal
          bill={selectedBill}
          onClose={handleCloseModal}
          isLoading={deleteBill.isPending}
          onDelete={() => handleDeleteBill(selectedBill)}
        />
      )}
    </Card>
  );
};
