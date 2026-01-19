import { useRef } from "react";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { Card, CardContent } from "../../ui/card";
import { Calendar } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

interface IModalDateFilter {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onClear?: () => void;
  OnAplly: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export const ModalDateFilter = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClear,
  OnAplly,
  onClose,
  isLoading,
}: IModalDateFilter) => {
  const editModalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(editModalRef, () => onClose());
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
              <Calendar className="w-5 h-5 text-primary" />
              Filtrar por data
            </h3>
          </div>

          <form onSubmit={OnAplly} className="space-y-4">
            <div className="flex gap-5 justify-center flex-col sm:flex-row">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Inicio
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 w-full sm:w-40"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Fim
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 w-full sm:w-40"
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
              {onClear && (
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    onClear();
                    onClose();
                  }}
                  disabled={isLoading}
                >
                  Limpar
                </Button>
              )}
              <Button
                type="submit"
                variant="premium"
                className="flex-1"
                disabled={isLoading}
                onClick={OnAplly}
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
