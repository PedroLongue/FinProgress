import { useRef, useState } from "react";
import type { ICreateOrUpdateGoalBody } from "../../../types/goal.type";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { Target } from "lucide-react";

interface ICreateOrupdateGoalModal {
  mode: "create" | "update";
  goal: number;
  isLoading: boolean;
  onSave: (body: ICreateOrUpdateGoalBody) => Promise<void> | void;
  onClose: () => void;
}

export const CreateOrupdateGoalModal = ({
  mode,
  goal,
  isLoading,
  onSave,
  onClose,
}: ICreateOrupdateGoalModal) => {
  const [amount, setAmount] = useState<number>(goal);

  const editModalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(editModalRef, () => onClose());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (onSave) {
      await onSave({ amount });
      onClose();
    }
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
            <h3 className="flex gap-2 items-center text-lg font-semibold text-foreground">
              <Target className="w-5 h-5 text-primary" />
              {mode === "create" ? "Crie " : "Atualize "} sua meta de gasto
              mensal
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              Valor (R$)
            </label>
            <Input
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
              }}
              placeholder="Ex: 3000"
              className="pl-10"
              required
              min={0}
              type="number"
            />

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
