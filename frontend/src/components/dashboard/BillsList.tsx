import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  PlusCircle,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { IBill, ICreateBillBody } from "../../types/bills.type";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import type { BillsResponse } from "../../queries/bills";
import { useState } from "react";
import { BillEditModal } from "./BillEditModal";
import {
  formatCurrency,
  formatDate,
  getStatusIcon,
  getStatusStyles,
} from "../../utils/bills.utils";
import { useBillsActions } from "../../hooks/useBills";
import { BillDeleteModal } from "./BillDeleteModal";
import { Link } from "@tanstack/react-router";

interface IBillsList {
  bills: BillsResponse;
  isEmpty: boolean;
  dashpage?: boolean;
  onAddBill?: () => void;
  onPageChange?: (page: number) => void;
}

export const BillsList = ({
  bills,
  isEmpty,
  onAddBill,
  onPageChange,
  dashpage = false,
}: IBillsList) => {
  const { updateBill, deleteBill } = useBillsActions();

  const [currentPage, setCurrentPage] = useState(bills.page || 1);
  const totalPages = bills.totalPages;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedBill, setSelectedBill] = useState<IBill | null>(null);

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
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/5 animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10" />
              </div>

              <div className="relative w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <FileText className="w-7 h-7 text-primary-foreground" />
              </div>

              <div className="absolute -top-2 -right-3 w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center animate-bounce-slow">
                <Sparkles className="w-3 h-3 text-success" />
              </div>
              <div className="absolute -bottom-1 -left-2 w-5 h-5 rounded-full bg-warning/20" />
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum boleto cadastrado
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
              Comece adicionando seus boletos para acompanhar vencimentos e
              nunca mais perca prazos.
            </p>

            <div className="w-full max-w-sm space-y-2 mb-6">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/20"
                  style={{ opacity: 1 - i * 0.25 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-muted/40" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-24 rounded bg-muted/50" />
                    <div className="h-2 w-16 rounded bg-muted/30" />
                  </div>
                  <div className="h-4 w-16 rounded bg-muted/40" />
                </div>
              ))}
            </div>

            {onAddBill && (
              <Button onClick={onAddBill} size="sm" className="gap-2">
                <PlusCircle className="w-4 h-4" />
                Cadastrar primeiro boleto
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {bills.bills.map((bill, index) => (
                <div
                  key={bill.id}
                  onClick={() => handleBillClick(bill)}
                  className={cn(
                    "group flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-all duration-200 animate-slide-up"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center border shrink-0",
                      getStatusStyles(bill.status)
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
                          bill.status === "OVERDUE"
                            ? "text-destructive font-medium"
                            : "text-muted-foreground"
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
                        bill.status === "PAID"
                          ? "text-success"
                          : bill.status === "OVERDUE"
                            ? "text-destructive"
                            : "text-foreground"
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
