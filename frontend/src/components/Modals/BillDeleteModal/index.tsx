import { Trash2 } from "lucide-react";
import type { IBill } from "../../../types/bills.type";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { useRef } from "react";

interface IBillDeleteModal {
  bill: IBill;
  onClose: () => void;
  isLoading?: boolean;
  onDelete?: (billId: string) => Promise<void> | void;
}

export const BillDeleteModal = ({
  bill,
  onClose,
  onDelete,
  isLoading = false,
}: IBillDeleteModal) => {
  const handleDelete = async () => {
    if (!onDelete) return;
    await onDelete(bill.id);
    onClose();
  };

  const deleteModalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(deleteModalRef, () => onClose());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <Card
        variant="elevated"
        className="relative w-full max-w-sm animate-scale-in"
        ref={deleteModalRef}
      >
        <CardContent className="p-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-destructive" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-center text-foreground mb-2">
            Excluir "{bill.title}"?
          </h3>

          <p className="text-sm text-muted-foreground text-center mb-6">
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
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
              type="button"
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
