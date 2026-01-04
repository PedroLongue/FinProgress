import { Card, CardContent } from "../ui/card";
import { Barcode, Calendar, DollarSign, Tag, ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { IBill, BillStatusKey } from "../../types/bills";
import { useState } from "react";
import { cn } from "../../lib/utils";

interface IEditBillModal {
  bill: IBill;
  onClose: () => void;
  onSave?: (updatedBill: Partial<IBill>) => Promise<void> | void;
  isLoading?: boolean;
}

export const BillEditModal = ({
  bill,
  onClose,
  onSave,
  isLoading = false,
}: IEditBillModal) => {
  const [title, setTitle] = useState(bill.title ?? "");
  const [amount, setAmount] = useState(bill.amount?.toString() ?? "");
  const [dueDate, setDueDate] = useState(() => {
    if (!bill.dueDate) return "";
    const date = new Date(bill.dueDate);
    return date.toISOString().split("T")[0];
  });
  const [barcode, setBarcode] = useState(bill.barcode ?? "");
  const [description, setDescription] = useState(bill.description ?? "");
  const [status, setStatus] = useState<BillStatusKey>(bill.status ?? "PENDING");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const statusOptions: Array<{
    value: BillStatusKey;
    label: string;
    color: string;
  }> = [
    { value: "PENDING", label: "Pendente", color: "text-yellow-500" },
    { value: "PAID", label: "Pago", color: "text-green-500" },
    { value: "OVERDUE", label: "Vencido", color: "text-red-500" },
  ];

  const getStatusRoundedColor = (status: BillStatusKey) => {
    switch (status) {
      case "PAID":
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case "OVERDUE":
        return <div className="w-2 h-2 rounded-full bg-red-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
    }
  };

  const getStatusLabel = (status: BillStatusKey) => {
    return (
      statusOptions.find((opt) => opt.value === status)?.label || "Pendente"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBill: Partial<IBill> = {
      title,
      amount: parseFloat(amount) || 0,
      dueDate: dueDate ? new Date(dueDate).toISOString() : bill.dueDate,
      barcode,
      description,
      status,
    };

    if (onSave) {
      await onSave(updatedBill);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onClose()}
      />
      <Card
        variant="elevated"
        className="relative w-full max-w-lg animate-scale-in"
      >
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Título
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Conta de Luz"
                  className="pl-10"
                  required
                />
              </div>
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
                    required
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
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm",
                    "border border-input rounded-md bg-background",
                    "transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {getStatusRoundedColor(status)}
                    <span>{getStatusLabel(status)}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-input rounded-md shadow-lg">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setStatus(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 text-sm",
                          "hover:bg-gray-800 transition-colors",
                          status === option.value && "bg-gray-800"
                        )}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${option.color.replace("text-", "bg-")}`}
                        />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
                onClick={() => onClose()}
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
