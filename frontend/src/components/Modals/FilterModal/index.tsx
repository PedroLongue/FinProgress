import { useRef } from "react";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { Card, CardContent } from "../../ui/card";
import { Calendar } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { dateFilterSchema, type DateFilterForm } from "./validator";
import { useForm } from "react-hook-form";
import { cn } from "../../../lib/utils";

interface IFilterModal {
  OnAplly: (data: DateFilterForm) => void;
  onClose: () => void;
  isLoading: boolean;
  startDate?: string;
  endDate?: string;
}

export const FilterModal = ({
  OnAplly,
  onClose,
  isLoading,
  startDate,
  endDate,
}: IFilterModal) => {
  const editModalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(editModalRef, () => onClose());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DateFilterForm>({
    resolver: zodResolver(dateFilterSchema),
    defaultValues: {
      startDate: startDate ?? "",
      endDate: endDate ?? "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: DateFilterForm) => {
    OnAplly(data);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-testid="date-filter-modal"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <Card
        variant="elevated"
        className="relative w-full max-w-lg animate-scale-in"
        ref={editModalRef}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h3 className="flex gap-2 items-center text-lg font-semibold text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              Filtrar por data
            </h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-5 justify-center flex-col sm:flex-row">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Inicio
                </label>
                <Input
                  type="date"
                  className={cn(
                    "h-9 w-full sm:w-40",
                    errors.startDate &&
                      "border-red-500! focus-visible:ring-red-500",
                  )}
                  {...register("startDate")}
                />
                {errors.startDate?.message && (
                  <p className="text-sm text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Fim
                </label>
                <Input
                  {...register("endDate")}
                  type="date"
                  className={cn(
                    "h-9 w-full sm:w-40",
                    errors.endDate &&
                      "border-red-500! focus-visible:ring-red-500",
                  )}
                />
                {errors.endDate?.message && (
                  <p className="text-sm text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
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
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  reset({ startDate: "", endDate: "" });
                }}
                disabled={isLoading}
              >
                Limpar
              </Button>
              <Button
                type="submit"
                variant="premium"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Aplicando..." : "Aplicar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
