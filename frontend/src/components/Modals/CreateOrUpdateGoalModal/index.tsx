import { useRef } from "react";
import type { CreateOrUpdateGoalBody } from "../../../types/goal.type";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalSchema } from "./validator";
import { cn } from "../../../lib/utils";

interface ICreateOrupdateGoalModal {
  mode: "create" | "update";
  goal: number;
  isLoading: boolean;
  onSave: (body: CreateOrUpdateGoalBody) => Promise<void> | void;
  onClose: () => void;
}

export const CreateOrupdateGoalModal = ({
  mode,
  goal,
  isLoading,
  onSave,
  onClose,
}: ICreateOrupdateGoalModal) => {
  const editModalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(editModalRef, () => onClose());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: { amount: goal || 0 },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: { amount: number }) => {
    if (onSave) {
      await onSave({ amount: data.amount });
      onClose();
    }
  };

  return (
    <div
      data-testid="goal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        data-testid="goal-modal-overlay"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      <Card
        data-testid="goal-modal-card"
        variant="elevated"
        className="relative w-full max-w-lg animate-scale-in"
        ref={editModalRef}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h3
              data-testid="goal-modal-title"
              className="flex gap-2 items-center text-lg font-semibold text-foreground"
            >
              <Target className="w-5 h-5 text-primary" />
              {mode === "create" ? "Crie " : "Atualize "} sua meta de gasto
              mensal
            </h3>
          </div>

          <form
            data-testid="goal-modal-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <label className="text-sm font-medium text-foreground">
              Valor (R$)
            </label>

            <Input
              data-testid="goal-amount-input"
              {...register("amount")}
              placeholder="Ex: 3000"
              className={cn(
                "pl-10",
                errors.amount && "border-red-500! focus-visible:ring-red-500",
              )}
              type="number"
            />

            {errors.amount?.message && (
              <p
                data-testid="goal-amount-error"
                className="text-sm text-destructive"
              >
                {errors.amount.message}
              </p>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                data-testid="goal-cancel"
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>

              <Button
                data-testid="goal-submit"
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
