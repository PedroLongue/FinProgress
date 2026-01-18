import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import type { ISpendingByCategoryReportData } from "../../types/reports.type";
import {
  dateInputToISO,
  formatCurrency,
  isoToDateInput,
} from "../../utils/bills.utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PieChart } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EmptyState } from "../layout/EmptyState";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ISpendingByCategory {
  spendingReportByCategoryData: ISpendingByCategoryReportData;
  isLoading?: boolean;
  onChangeRange: (start?: string, end?: string) => void;
  isEmpty: boolean;
}

export const SpendingByCategory = ({
  spendingReportByCategoryData,
  isLoading = false,
  onChangeRange,
  isEmpty,
}: ISpendingByCategory) => {
  const initialStart = isoToDateInput(
    spendingReportByCategoryData?.range?.start,
  );
  const initialEnd = isoToDateInput(spendingReportByCategoryData?.range?.end);

  const [startCategoryDate, setStartCategoryDate] = useState(initialStart);
  const [endCategoryDate, setEndCategoryDate] = useState(initialEnd);

  const labels = useMemo(
    () => spendingReportByCategoryData.byCategory.map((c) => c.category),
    [spendingReportByCategoryData.byCategory],
  );

  const values = useMemo(
    () => spendingReportByCategoryData.byCategory.map((c) => c.total),
    [spendingReportByCategoryData.byCategory],
  );

  const counts = useMemo(
    () => spendingReportByCategoryData.byCategory.map((c) => c.count),
    [spendingReportByCategoryData.byCategory],
  );

  const totalInRange = spendingReportByCategoryData?.totals?.totalInRange ?? 0;

  const getSimpleColors = (count: number) => {
    const primary = "#3c83f6";

    const baseColors = ["#3c83f6", "#10b77f", "#f28f07", "#dc2828", "#7588a3"];

    const colors = [...baseColors];

    for (let i = baseColors.length; i < count; i++) {
      const isLighter = i % 2 === 0;
      const variation = isLighter ? "cc" : "99";

      const newColor = primary.slice(0, -2) + variation;
      colors.push(newColor);
    }

    return colors.slice(0, count);
  };

  const data: ChartData<"pie", number[], string> = {
    labels,
    datasets: [
      {
        label: "Gasto por categoria",
        data: values,
        backgroundColor: getSimpleColors(labels.length),
        borderColor: "#29303d",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "hsl(215, 20%, 55%)",
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: {
        padding: 12,
        displayColors: true,
        callbacks: {
          title: (items: TooltipItem<"pie">[]) =>
            items[0]?.label ?? "Categoria",
          label: (ctx: TooltipItem<"pie">) => {
            const value = Number(ctx.parsed ?? 0);
            const pct =
              totalInRange > 0
                ? Number(((value / totalInRange) * 100).toFixed(2))
                : 0;
            return `Valor: ${formatCurrency(value)} (${pct.toString().replace(".", ",")}%)`;
          },
          afterLabel: (ctx: TooltipItem<"pie">) => {
            const i = ctx.dataIndex;
            const count = counts[i] ?? 0;
            const plural = count === 1 ? "conta" : "contas";
            return `Qtd: ${count} ${plural}`;
          },
        },
      },
    },
  };

  const handleApply = () => {
    const start = startCategoryDate
      ? dateInputToISO(startCategoryDate)
      : undefined;
    const end = endCategoryDate ? dateInputToISO(endCategoryDate) : undefined;

    onChangeRange(start, end);
  };

  const handleClear = () => {
    setStartCategoryDate("");
    setEndCategoryDate("");
    onChangeRange?.(undefined, undefined);
  };

  const rangeText = (() => {
    const start = spendingReportByCategoryData?.range?.start;
    const end = spendingReportByCategoryData?.range?.end;
    if (!start || !end) return "Mês atual (por vencimento)";
    const s = isoToDateInput(start).split("-").reverse().join("/");
    const e = isoToDateInput(end).split("-").reverse().join("/");
    return `Vencimentos de ${s} até ${e}`;
  })();

  return (
    <div className="space-y-4">
      <Card variant="gradient" className="overflow-hidden">
        <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <PieChart className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Gastos por categoria</CardTitle>
              {!isEmpty && (
                <CardDescription>
                  {rangeText}. Passe o mouse para ver valor, % e quantidade.
                </CardDescription>
              )}
            </div>
          </div>

          {!isEmpty && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Início</span>
                  <Input
                    type="date"
                    value={startCategoryDate}
                    onChange={(e) => setStartCategoryDate(e.target.value)}
                    className="h-9 w-full sm:w-40"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Fim</span>
                  <Input
                    type="date"
                    value={endCategoryDate}
                    onChange={(e) => setEndCategoryDate(e.target.value)}
                    className="h-9 w-full sm:w-40"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-9"
                  onClick={handleClear}
                  disabled={isLoading}
                >
                  Limpar
                </Button>
                <Button
                  type="button"
                  variant="premium"
                  className="h-9"
                  onClick={handleApply}
                  disabled={isLoading}
                >
                  {isLoading ? "Aplicando..." : "Aplicar"}
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        {isEmpty ? (
          <EmptyState type="category" />
        ) : (
          <CardContent className="p-6">
            <div className="h-80">
              <Pie options={options} data={data} />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
