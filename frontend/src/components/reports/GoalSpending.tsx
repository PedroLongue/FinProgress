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
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BarChart3 } from "lucide-react";
import { AppSelect } from "../ui/app-select";
import { EmptyState } from "../layout/EmptyState";
import type { IMonthlyGoalHistory } from "../../types/goal.type";
import { formatCurrency } from "../../utils/bills.utils";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface IGoalReports {
  rows: IMonthlyGoalHistory[];
  monthFilter: 3 | 6 | 12;
  setMonthFilter: Dispatch<SetStateAction<3 | 6 | 12>>;
  isEmpty: boolean;
}

export const GoalSpending = ({
  rows,
  monthFilter,
  setMonthFilter,
  isEmpty,
}: IGoalReports) => {
  const labels = useMemo(() => rows.map((m) => m.month), [rows]);

  const spentValues = useMemo(() => rows.map((m) => m.spent), [rows]);

  const goalValues = useMemo(() => rows.map((m) => m.goalAmount ?? 0), [rows]);

  const barThickness = rows.length > 10 ? 14 : 18;

  const chartHeight = useMemo(() => {
    const rowH = 44;
    const base = 140;
    return Math.min(720, base + rows.length * rowH);
  }, [rows.length]);

  const data: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: "Gasto (R$)",
        data: spentValues,
        backgroundColor: "#3b82f6",
        borderColor: "#1d4ed8",
        borderWidth: 2,
        borderRadius: 8,
        barThickness,
      },
      {
        label: "Meta (R$)",
        data: goalValues,
        backgroundColor: "#22c55e",
        borderColor: "#166534",
        borderWidth: 2,
        borderRadius: 8,
        barThickness,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",

    plugins: {
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
          title: (items) => items[0]?.label ?? "Mês",
          label: (ctx) => {
            const i = ctx.dataIndex;
            const row = rows[i];
            const value = Number(ctx.parsed.x ?? 0);

            if (
              ctx.dataset.label === "Meta (R$)" &&
              (!row?.goalAmount || row.goalAmount <= 0)
            ) {
              return "Meta: Sem meta";
            }

            const prefix = ctx.dataset.label?.startsWith("Gasto")
              ? "Gasto"
              : "Meta";
            return `${prefix}: ${formatCurrency(value)}`;
          },
          afterLabel: (ctx) => {
            const i = ctx.dataIndex;
            const row = rows[i];
            if (!row?.goalAmount || row.goalAmount <= 0) return "";

            const pct = (row.spent / row.goalAmount) * 100;
            const status =
              pct >= 100
                ? "Limite atingido"
                : pct >= 80
                  ? "Próximo do limite"
                  : "Ok";
            return `${status} • ${Math.min(999, Math.max(0, pct)).toFixed(0)}% usado`;
          },
        },
      },
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "hsl(215, 20%, 70%)",
          usePointStyle: true,
          pointStyle: "rectRounded",
          padding: 12,
          boxWidth: 10,
          boxHeight: 10,
          font: { size: 12 },
        },
      },
    },

    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "hsl(var(--border))" },
        ticks: {
          color: "hsl(215, 20%, 55%)",
          callback: (v) => `R$ ${Number(v).toFixed(0)}`,
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "hsl(215, 20%, 55%)",
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
    },

    devicePixelRatio: 2,
  };

  const monthOptions = [
    { value: 3, label: "Últimos 3 meses" },
    { value: 6, label: "Últimos 6 meses" },
    { value: 12, label: "Últimos 12 meses" },
  ] as const;

  return (
    <div className="space-y-4">
      <Card variant="gradient" className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Meta x Gasto</CardTitle>
              {!isEmpty && (
                <CardDescription className="mt-1">
                  Comparativo por mês. Passe o mouse para ver valores e status.
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
                className="min-w-90 md:min-w-0"
                style={{ height: chartHeight }}
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
