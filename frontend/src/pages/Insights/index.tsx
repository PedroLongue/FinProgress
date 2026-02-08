import { useMemo, useState } from "react";
import { MonthlySpending } from "../../components/reports/MonthlySpending";
import { useSpendingReports } from "../../hooks/useSpendingReports";
import { Loading } from "../../components/ui/loading";
import type {
  ISpendingByCategoryReportData,
  ISpendingReportData,
} from "../../types/reports.type";
import { Card, CardContent } from "../../components/ui/card";
import {
  DollarSign,
  Minus,
  PencilIcon,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Progress } from "../../components/ui/progress";
import {
  useMonthlyGoal,
  useMonthlyGoalActions,
  useMonthlyGoalHistory,
} from "../../hooks/useMonthlyGoal";
import { Button } from "../../components/ui/button";
import { EmptyInsightsCardsState } from "../../components/layout/EmptyInsightsCardsState";
import { CreateOrupdateGoalModal } from "../../components/Modals/CreateOrUpdateGoalModal";
import { useSpendingByCategoryReport } from "../../hooks/useSpendingByCategoryReport ";
import { SpendingByCategory } from "../../components/reports/SpendingByCategory";
import { GoalSpending } from "../../components/reports/GoalSpending";
import type { MonthlyGoalHistory } from "../../types/goal.type";
import { dateToText } from "../../utils/date.utils";
import { formatCurrency } from "../../utils/bills.utils";
import { useIsMobile } from "../../hooks/useMobile";
import { cn } from "../../lib/utils";

export const Insights = () => {
  const [spendMonthFilter, setSpendMonthFilter] = useState<3 | 6 | 12>(3);
  const [historyGoalRange, setHistoryGoalRange] = useState<3 | 6 | 12>(3);
  const [openGoalModal, setOpenGoalModal] = useState<boolean>(false);
  const [goalMode, setGoalMode] = useState<"create" | "update">("create");
  const [start, setStart] = useState<string | undefined>();
  const [end, setEnd] = useState<string | undefined>();

  const { spendingReport, isLoading: reportLoading } =
    useSpendingReports(spendMonthFilter);
  const { monthlyGoal, isLoading: goalLoading } = useMonthlyGoal();
  const { goalHistory, isLoading: goalHistoryLoading } =
    useMonthlyGoalHistory(historyGoalRange);
  const { createOrUpdateGoal } = useMonthlyGoalActions();
  const { spendingByCategoryReport, isLoading: spendingByCategoryLoading } =
    useSpendingByCategoryReport(start, end);
  const isMobile = useIsMobile();

  const isLoading =
    reportLoading ||
    goalLoading ||
    spendingByCategoryLoading ||
    goalHistoryLoading;

  const byMonth = useMemo(
    () => spendingReport?.byMonth ?? [],
    [spendingReport?.byMonth],
  );

  const { currMonth, trendValueAbs, trend, topMonth } = useMemo(() => {
    const monthsCount = byMonth.length;
    const prev = monthsCount > 1 ? byMonth[monthsCount - 2] : null;
    const curr =
      spendingReport?.currentMonth ??
      (monthsCount > 0 ? byMonth[monthsCount - 1] : null);

    const delta = prev && curr ? curr.total - prev.total : 0;

    const trendPct: number | null = (() => {
      if (!prev || !curr) return null;
      const base = prev.total;
      if (base === 0) return curr.total === 0 ? 0 : null;
      const pct = ((curr.total - base) / base) * 100;
      return Number(pct.toFixed(2));
    })();

    const t = (() => {
      if (delta > 0)
        return {
          Icon: TrendingUp,
          label: "Aumentou",
          tone: "text-red-500" as const,
        };
      if (delta < 0)
        return {
          Icon: TrendingDown,
          label: "Reduziu",
          tone: "text-emerald-500" as const,
        };
      return {
        Icon: Minus,
        label: "Estável",
        tone: "text-muted-foreground" as const,
      };
    })();

    const top =
      monthsCount > 0
        ? byMonth.reduce(
            (best, m) => (m.total > best.total ? m : best),
            byMonth[0],
          )
        : null;

    return {
      prevMonth: prev,
      currMonth: curr,
      deltaValue: delta,
      trendValue: trendPct,
      trendValueAbs: trendPct === null ? null : Math.abs(trendPct),
      trend: t,
      topMonth: top,
    };
  }, [byMonth, spendingReport?.currentMonth]);

  const goalAmount = monthlyGoal?.goalAmount ?? 0;
  const percentUsed = monthlyGoal?.percentUsed ?? 0;
  const showTrend = trendValueAbs !== null;

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-24 lg:pb-6">
      <h1 className="text-2xl font-bold">Análise de gastos</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card variant="gradient" className="w-full">
          <CardContent className="pt-6">
            {currMonth && currMonth?.total > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/20">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total gasto no mês
                    </p>
                    <p
                      className={cn(
                        isMobile ? "text-xl" : "text-2xl",
                        "font-bold text-foreground",
                      )}
                    >
                      {formatCurrency(currMonth.total)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Contas pagas no mês atual, mesmo vencidas ou cadastradas antes
                </p>
                {showTrend && (
                  <div className="flex items-center gap-1 mt-3 text-sm">
                    <trend.Icon className={`h-4 w-4 ${trend.tone}`} />
                    <span className={trend.tone}>
                      {trend.label}{" "}
                      {trendValueAbs?.toString().replace(".", ",")}%
                    </span>
                    <span className="text-muted-foreground">
                      vs. mês anterior
                    </span>
                  </div>
                )}
              </>
            ) : (
              <EmptyInsightsCardsState type="total" />
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="pt-6">
            {goalAmount > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-success/20">
                      <Target className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Meta de orçamento
                      </p>
                      <p
                        className={cn(
                          isMobile ? "text-xl" : "text-2xl",
                          "font-bold text-foreground",
                        )}
                      >
                        {formatCurrency(goalAmount)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setOpenGoalModal(true);
                      setGoalMode("update");
                    }}
                    size={isMobile ? "sm" : undefined}
                  >
                    <PencilIcon />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Baseado nas contas que vencem neste mês
                </p>
                <div className="mt-3">
                  <Progress value={percentUsed} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {percentUsed.toFixed(2).replace(".", ",")}% utilizado
                  </p>
                </div>
              </>
            ) : (
              <EmptyInsightsCardsState
                type="goal"
                onConfigureGoal={() => setOpenGoalModal(true)}
              />
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="pt-6">
            {topMonth && topMonth.total > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-warning/20">
                    <TrendingUp className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Volume e pico
                    </p>
                    <p
                      className={cn(
                        isMobile ? "text-xl" : "text-2xl",
                        "font-bold text-foreground",
                      )}
                    >
                      Maior gasto
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Considera apenas contas pagas no mês
                </p>

                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Mês</span>
                    <span className="text-sm font-medium">
                      {topMonth?.month ? dateToText(topMonth.month) : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Valor</span>
                    <span className="text-sm font-medium">
                      {topMonth ? formatCurrency(topMonth.total) : "—"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <EmptyInsightsCardsState type="volume" />
            )}
          </CardContent>
        </Card>
      </div>
      <MonthlySpending
        spendingReportData={spendingReport as ISpendingReportData}
        monthFilter={spendMonthFilter}
        setMonthFilter={setSpendMonthFilter}
        isEmpty={(spendingReport?.totals.totalInRange ?? 0) === 0}
      />

      <SpendingByCategory
        spendingReportByCategoryData={
          spendingByCategoryReport as ISpendingByCategoryReportData
        }
        isLoading={spendingByCategoryLoading}
        onChangeRange={(s, e) => {
          setStart(s);
          setEnd(e);
        }}
        isEmpty={
          (spendingByCategoryReport?.totals?.totalInRange ?? 0) === 0 ||
          (spendingByCategoryReport?.byCategory?.length ?? 0) === 0
        }
      />

      <GoalSpending
        rows={goalHistory as MonthlyGoalHistory[]}
        monthFilter={historyGoalRange}
        setMonthFilter={setHistoryGoalRange}
        isEmpty={false}
      />

      {openGoalModal && (
        <CreateOrupdateGoalModal
          mode={goalMode}
          goal={monthlyGoal?.goalAmount as number}
          isLoading={createOrUpdateGoal.isPending}
          onSave={(body) => createOrUpdateGoal.mutate(body)}
          onClose={() => setOpenGoalModal(false)}
        />
      )}
    </div>
  );
};
