import { useMemo, type Dispatch, type SetStateAction } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { BarChart3 } from "lucide-react";
import { AppSelect } from "../../ui/app-select";
import type { ISpendingReportData } from "../../../types/reports.type";
import { formatCurrency } from "../../../utils/bills.utils";
import { EmptyState } from "../../layout/EmptyState";
import { useIsMobile } from "../../../hooks/useMobile";
import { formatMonthLabel } from "../../../utils/date.utils";
import { cn } from "../../../lib/utils";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface IMonthlySpending {
  spendingReportData: ISpendingReportData;
  monthFilter: 3 | 6 | 12;
  setMonthFilter: Dispatch<SetStateAction<3 | 6 | 12>>;
  isEmpty: boolean;
}

export const MonthlySpending = ({
  spendingReportData,
  monthFilter,
  setMonthFilter,
  isEmpty,
}: IMonthlySpending) => {
  const isMobile = useIsMobile();

  const labels = useMemo(
    () => spendingReportData.byMonth.map((m) => formatMonthLabel(m.month)),
    [spendingReportData.byMonth],
  );

  const values = useMemo(
    () => spendingReportData.byMonth.map((m) => m.total),
    [spendingReportData.byMonth],
  );

  const pxPerBar = isMobile ? 52 : 0;
  const chartMinWidth = isMobile ? Math.max(360, labels.length * pxPerBar) : 0;

  const barThickness = isMobile
    ? labels.length > 6
      ? 18
      : 26
    : labels.length > 6
      ? 28
      : 44;

  const chartHeight = useMemo(() => {
    const base = 260;
    const extra = Math.max(0, spendingReportData.byMonth.length - 3) * 18;
    return Math.min(420, base + extra);
  }, [spendingReportData.byMonth.length]);

  const data: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: "Gasto (R$)",
        data: values,
        backgroundColor: "hsl(217, 91%, 60%) / 0.75)",
        borderColor: "hsl(217, 91%, 60%)",
        borderWidth: 1,
        borderRadius: 5,
        barThickness,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
          title: (items: TooltipItem<"bar">[]) => {
            const i = items[0];
            return i.label ?? "Mês";
          },
          label: (ctx: TooltipItem<"bar">) => {
            const i = ctx.dataIndex;
            const row = spendingReportData.byMonth[i];
            const total = row ? row.total : Number(ctx.parsed.y ?? 0);
            return `Gasto: ${formatCurrency(total)}`;
          },
          afterLabel: (ctx: TooltipItem<"bar">) => {
            const i = ctx.dataIndex;
            const row = spendingReportData.byMonth[i];
            const count = row ? row.count : 0;
            const plural = count === 1 ? "conta" : "contas";
            return `Qtd: ${count} ${plural}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "hsl(215, 20%, 55%)",
          autoSkip: false,
          maxTicksLimit: isMobile ? 4 : 6,
          maxRotation: isMobile ? 35 : 0,
          minRotation: isMobile ? 35 : 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "hsl(var(--border))" },
        ticks: {
          color: "hsl(215, 20%, 55%)",
          callback: (value) => `R$ ${Number(value).toFixed(0)}`,
          maxTicksLimit: 5,
        },
      },
    },
  };

  const monthOptions = [
    { value: 3, label: "Últimos 3 meses" },
    { value: 6, label: "ùltimos 6 meses" },
    { value: 12, label: "Últimos 12 meses" },
  ] as const;

  return (
    <div className="space-y-4" data-testid="monthly-spending-component">
      <Card variant="gradient" className="overflow-hidden">
        <CardHeader
          className={cn(
            "flex flex-row items-center justify-between",
            isMobile ? "flex-col items-stretch gap-2" : "",
          )}
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <div className="w-full">
              <CardTitle className={cn(isMobile ? "text-base" : "text-lg")}>
                Gastos Mensais
              </CardTitle>
              {!isEmpty && (
                <CardDescription className="mt-1">
                  Últimos {spendingReportData.rangeMonths} meses (pagos). Passe
                  o mouse para ver valor e quantidade de contas.
                </CardDescription>
              )}
            </div>
          </div>
          {!isEmpty && (
            <AppSelect
              value={monthFilter}
              onChange={(v) => setMonthFilter(v as 3 | 6 | 12)}
              ariaLabel="Filtrar por período"
              options={monthOptions.map((o) => ({
                ...o,
                value: String(o.value),
              }))}
            />
          )}
        </CardHeader>

        {isEmpty ? (
          <EmptyState type="spending" />
        ) : (
          <CardContent className="p-6">
            <div className="w-full overflow-x-auto md:overflow-visible">
              <div
                style={{
                  height: chartHeight,
                  width: "100%",
                  minWidth: isMobile ? chartMinWidth : undefined,
                }}
              >
                <Bar options={options} data={data} />
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
