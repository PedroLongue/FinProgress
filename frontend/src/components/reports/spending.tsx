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
} from "../ui/card";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Minus,
  Sigma,
  Crown,
  DollarSign,
} from "lucide-react";
import { AppSelect } from "../ui/app-select";
import type { ISpendingReportData } from "../../types/reports.type";
import { formatCurrency } from "../../utils/bills.utils";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const pctChange = (current: number, prev: number): number | null => {
  if (prev === 0) return current === 0 ? 0 : null;
  return ((current - prev) / prev) * 100;
};

interface ISpendingReports {
  spendingReportData: ISpendingReportData;
  monthFilter: 3 | 6 | 12;
  setMonthFilter: Dispatch<SetStateAction<3 | 6 | 12>>;
}

export const SpendingReports = ({
  spendingReportData,
  monthFilter,
  setMonthFilter,
}: ISpendingReports) => {
  const labels = useMemo(
    () => spendingReportData.byMonth.map((m) => m.month),
    [spendingReportData.byMonth]
  );

  const values = useMemo(
    () => spendingReportData.byMonth.map((m) => m.total),
    [spendingReportData.byMonth]
  );

  const monthsCount = spendingReportData.byMonth.length;
  const prevMonth =
    monthsCount >= 2 ? spendingReportData.byMonth[monthsCount - 2] : null;
  const currMonth = spendingReportData.byMonth[monthsCount - 1];

  const deltaValue = prevMonth ? currMonth.total - prevMonth.total : 0;
  const deltaPct = prevMonth
    ? pctChange(currMonth.total, prevMonth.total)
    : null;

  const avgSpend =
    monthsCount > 0
      ? spendingReportData.byMonth.reduce((acc, m) => acc + m.total, 0) /
        monthsCount
      : 0;

  const avgBills =
    monthsCount > 0
      ? spendingReportData.byMonth.reduce((acc, m) => acc + m.count, 0) /
        monthsCount
      : 0;

  const topMonth =
    monthsCount > 0
      ? spendingReportData.byMonth.reduce(
          (best, m) => (m.total > best.total ? m : best),
          spendingReportData.byMonth[0]
        )
      : null;

  const trend = (() => {
    if (!prevMonth)
      return {
        Icon: Minus,
        label: "Sem comparação",
        tone: "text-muted-foreground",
      };
    if (deltaValue > 0)
      return { Icon: TrendingUp, label: "Aumentou", tone: "text-red-500" };
    if (deltaValue < 0)
      return { Icon: TrendingDown, label: "Reduziu", tone: "text-emerald-500" };
    return { Icon: Minus, label: "Estável", tone: "text-muted-foreground" };
  })();

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
        barThickness: 70,
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
          maxRotation: 0,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "hsl(var(--border))",
        },
        ticks: {
          color: "hsl(215, 20%, 55%)",
          callback: (value) => `R$ ${Number(value).toFixed(0)}`,
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
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription>Variação (mês atual vs anterior)</CardDescription>
            <CardTitle className="flex items-center gap-2 text-base">
              <trend.Icon className={`h-4 w-4 ${trend.tone}`} />
              <span className="font-semibold">{trend.label}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-2xl font-semibold">
                  {formatCurrency(Math.abs(deltaValue))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {prevMonth
                    ? `Anterior: ${formatCurrency(prevMonth.total)}`
                    : "—"}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${trend.tone}`}>
                  {deltaPct === null
                    ? "—"
                    : `${deltaPct >= 0 ? "+" : ""}${deltaPct.toFixed(1)}%`}
                </div>
                <div className="text-xs text-muted-foreground">
                  Atual: {formatCurrency(currMonth.total)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription>Média de gastos</CardDescription>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sigma className="h-4 w-4 text-primary" />
              <span className="font-semibold">Por mês</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold">
              {formatCurrency(avgSpend)}
            </div>
            <div className="text-xs text-muted-foreground">
              Considerando {monthsCount} {monthsCount === 1 ? "mês" : "meses"}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription>Volume e pico</CardDescription>
            <CardTitle className="flex items-center gap-2 text-base">
              <Crown className="h-4 w-4 text-primary" />
              <span className="font-semibold">Maior gasto</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Mês</span>
              <span className="text-sm font-medium">
                {topMonth?.month ?? "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Valor</span>
              <span className="text-sm font-medium">
                {topMonth ? formatCurrency(topMonth.total) : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Média de contas
              </span>
              <span className="text-sm font-medium">
                {avgBills.toFixed(1)}/mês
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="gradient" className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Gastos Mensais</CardTitle>
              <CardDescription>
                Últimos {spendingReportData.rangeMonths} meses (pagos). Passe o
                mouse para ver valor e quantidade de contas.
              </CardDescription>
            </div>
          </div>
          <AppSelect
            value={monthFilter}
            onChange={(v) => setMonthFilter(v as 3 | 6 | 12)}
            ariaLabel="Filtrar por período"
            options={monthOptions.map((o) => ({
              ...o,
              value: String(o.value),
            }))}
          />
        </CardHeader>

        <CardContent className="p-6">
          <div className="h-80">
            <Bar options={options} data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
