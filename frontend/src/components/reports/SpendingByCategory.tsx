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
import { formatCurrency } from "../../utils/bills.utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar, PieChart } from "lucide-react";
import { Button } from "../ui/button";
import { EmptyState } from "../layout/EmptyState";
import { FilterModal } from "../Modals/FilterModal";
import type { DateFilterForm } from "../Modals/FilterModal/validator";
import { dateInputToISO, isoToDateInput } from "../../utils/date.utils";
import { cn } from "../../lib/utils";
import { useIsMobile } from "../../hooks/useMobile";

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
  const isMobile = useIsMobile();

  const [openFilterModal, setOpenFilterModal] = useState(false);

  const initialStart = isoToDateInput(
    spendingReportByCategoryData?.range?.start,
  );
  const initialEnd = isoToDateInput(spendingReportByCategoryData?.range?.end);

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
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          color: "hsl(215, 20%, 70%)",
          usePointStyle: true,
          pointStyle: "rectRounded",
          padding: 16,
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: {
        padding: 12,
        displayColors: false,
        backgroundColor: "hsl(222, 47%, 11%)",
        titleColor: "hsl(210, 40%, 96%)",
        bodyColor: "hsl(210, 40%, 96%)",
        borderColor: "hsl(215, 25%, 27%)",
        borderWidth: 1,
        cornerRadius: 6,
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

  const handleApply = (data: DateFilterForm) => {
    const start = data.startDate ? dateInputToISO(data.startDate) : undefined;
    const end = data.endDate ? dateInputToISO(data.endDate) : undefined;

    onChangeRange(start, end);
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
        <CardHeader className="flex gap-3 flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <PieChart className="w-5 h-5 text-primary" />
            <div className="w-full">
              <CardTitle className={cn(isMobile ? "text-base" : "text-lg")}>
                Gastos por categoria
              </CardTitle>
              {!isEmpty && (
                <CardDescription className="mt-1">
                  {rangeText}. Passe o mouse para ver valor, % e quantidade.
                </CardDescription>
              )}
            </div>
          </div>

          <Button onClick={() => setOpenFilterModal(true)}>
            <Calendar className="w-5 h-5" />
          </Button>
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

      {openFilterModal && (
        <FilterModal
          onClose={() => setOpenFilterModal(false)}
          isLoading={isLoading}
          OnAplly={(data: DateFilterForm) => handleApply(data)}
          startDate={initialStart}
          endDate={initialEnd}
        />
      )}
    </div>
  );
};
