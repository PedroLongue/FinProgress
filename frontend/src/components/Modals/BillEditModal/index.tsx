import { Card, CardContent } from "../../ui/card";
import { Barcode, Calendar, DollarSign, Tag, Check } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import type { Bill } from "../../../types/bills.type";
import { useRef, useState } from "react";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { getStatusBadge } from "../../../functions";
import { cn } from "../../../lib/utils";
import { isPaid } from "../../../functions";

interface IEditBillModal {
  bill: Bill;
  onClose: () => void;
  onSave?: (updatedBill: Partial<Bill>) => Promise<void> | void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export const BillEditModal = ({
  bill,
  onClose,
  onSave,
  isLoading = false,
  isEditing = false,
}: IEditBillModal) => {
  const [title, setTitle] = useState(bill.title);
  const [amount, setAmount] = useState(bill.amount?.toString() ?? "");
  const [dueDate, setDueDate] = useState(() => {
    if (!bill.dueDate) return "";
    const date = new Date(bill.dueDate);
    return date.toISOString().split("T")[0];
  });
  const [barcode, setBarcode] = useState(bill.barcode ?? "");
  const [description, setDescription] = useState(bill.description ?? "");

  const [titleError, setTitleError] = useState<string | null>("");

  const status = bill.status;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBill: Partial<Bill> = {
      title,
      barcode,
      description,
    };

    if (onSave) {
      await onSave(updatedBill);
    }
  };

  const handleMarkAsPaid = async () => {
    if (onSave) {
      await onSave({
        status: "PAID",
        paidAt: new Date().toISOString(),
      });
    }
  };

  const editModalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(editModalRef, () => onClose());

  const validateTitle = (value: string) => {
    const v = value.trim();
    if (!v) return "Informe o título";
    if (v.length < 2) return "Título deve ter no mínimo 2 caracteres";
    if (v.length > 50) return "Título deve ter no máximo 50 caracteres";
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <Card
        variant="elevated"
        className="relative w-full max-w-lg animate-scale-in"
        ref={editModalRef}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h3 className="text-lg font-semibold text-foreground">
              Editar Boleto
            </h3>
            {getStatusBadge(status)}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Título
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={title}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTitle(v);
                    if (titleError) setTitleError(validateTitle(v));
                  }}
                  onBlur={() => setTitleError(validateTitle(title))}
                  placeholder="Ex: Conta de Luz"
                  className={cn(
                    "pl-10",
                    titleError
                      ? "border-red-500! focus-visible:ring-red-500"
                      : "",
                  )}
                  required
                />
              </div>
              {titleError && (
                <p className="text-sm text-destructive">{titleError}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Valor (R$)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="pl-10"
                    disabled={isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Vencimento
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="pl-10"
                    disabled={isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Status atual
                </span>
                <span className="font-medium">{getStatusBadge(status)}</span>
              </div>

              {bill.paidAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Data do pagamento
                  </span>
                  <span className="font-medium">
                    {new Date(bill.paidAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
            </div>

            {!isPaid(status) && (
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                  onClick={handleMarkAsPaid}
                  disabled={isLoading}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Marcar como Pago
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Ao marcar como pago, a data atual será registrada
                  automaticamente
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do boleto..."
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Código de Barras
              </label>
              <div className="relative">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="00000.00000 00000.000000 00000.000000 0 00000000000000"
                  className="pl-10 font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="premium"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
