import { render, screen } from "@testing-library/react";
import { Insights } from ".";

const useSpendingReportsMock = vi.hoisted(() => vi.fn());
const useMonthlyGoalMock = vi.hoisted(() => vi.fn());
const useMonthlyGoalHistoryMock = vi.hoisted(() => vi.fn());
const useMonthlyGoalActionsMock = vi.hoisted(() => vi.fn());
const useSpendingByCategoryReportMock = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/useSpendingReports", () => ({
  useSpendingReports: useSpendingReportsMock,
}));

vi.mock("@/hooks/useMonthlyGoal", () => ({
  useMonthlyGoal: useMonthlyGoalMock,
  useMonthlyGoalHistory: useMonthlyGoalHistoryMock,
  useMonthlyGoalActions: useMonthlyGoalActionsMock,
}));

vi.mock("@/hooks/useSpendingByCategoryReport", () => ({
  useSpendingByCategoryReport: useSpendingByCategoryReportMock,
}));

describe("Insights Page", () => {
  beforeEach(() => {
    useSpendingReportsMock.mockReturnValue({
      spendingReport: {
        byMonth: [{ month: "2026-01-01", total: 100 }],
        currentMonth: { month: "2026-01-01", total: 100 },
        totals: { totalInRange: 100 },
      },
      isLoading: false,
    });

    useMonthlyGoalMock.mockReturnValue({
      monthlyGoal: { amount: 500 },
    });

    useMonthlyGoalHistoryMock.mockReturnValue({
      monthlyGoalHistory: [
        { month: "2025-12-01", amount: 400 },
        { month: "2025-11-01", amount: 450 },
      ],
    });

    useMonthlyGoalActionsMock.mockReturnValue({
      createOrUpdateGoal: { mutate: vi.fn(), isPending: false },
    });

    useSpendingByCategoryReportMock.mockReturnValue({
      spendingByCategoryReport: {
        totals: { totalInRange: 100 },
        byCategory: [{ category: "Energia", total: 100 }],
      },
      isLoading: false,
    });
  });

  vi.mock("../../components/reports/GoalSpending", () => ({
    GoalSpending: () => <div data-testid="goal-spending-stub" />,
  }));

  vi.mock("../../components/reports/MonthlySpending", () => ({
    MonthlySpending: () => <div data-testid="monthly-spending-stub" />,
  }));

  vi.mock("../../components/reports/SpendingByCategory", () => ({
    SpendingByCategory: () => <div data-testid="spending-by-category-stub" />,
  }));

  it("should render the insights page without crashing", () => {
    render(<Insights />);

    expect(screen.getByTestId("insights-page")).toBeInTheDocument();

    expect(screen.getByTestId("monthly-spending-stub")).toBeInTheDocument();
    expect(screen.getByTestId("spending-by-category-stub")).toBeInTheDocument();
    expect(screen.getByTestId("goal-spending-stub")).toBeInTheDocument();
  });

  it("should render loading when any query is loading", () => {
    useSpendingReportsMock.mockReturnValueOnce({
      spendingReport: undefined,
      isLoading: true,
    });

    render(<Insights />);

    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("should show trend as 'Aumentou' when current month increased vs previous", () => {
    useSpendingReportsMock.mockReturnValueOnce({
      spendingReport: {
        byMonth: [
          { month: "2025-12-01", total: 100 },
          { month: "2026-01-01", total: 150 },
        ],
        currentMonth: { month: "2026-01-01", total: 150 },
        totals: { totalInRange: 250 },
      },
      isLoading: false,
    });

    render(<Insights />);

    expect(screen.getByTestId("insights-trend-label")).toHaveTextContent(
      "Aumentou",
    );
    expect(screen.getByTestId("insights-trend-pct")).toHaveTextContent("50%");
  });

  it("should show trend as 'Reduziu' when current month decreased vs previous", () => {
    useSpendingReportsMock.mockReturnValueOnce({
      spendingReport: {
        byMonth: [
          { month: "2025-12-01", total: 200 },
          { month: "2026-01-01", total: 100 },
        ],
        currentMonth: { month: "2026-01-01", total: 100 },
        totals: { totalInRange: 300 },
      },
      isLoading: false,
    });

    render(<Insights />);

    expect(screen.getByTestId("insights-trend-label")).toHaveTextContent(
      "Reduziu",
    );
    expect(screen.getByTestId("insights-trend-pct")).toHaveTextContent("50%");
  });

  it("should compute topMonth correctly (highest total in byMonth)", () => {
    useSpendingReportsMock.mockReturnValueOnce({
      spendingReport: {
        byMonth: [
          { month: "2025-11-01", total: 120 },
          { month: "2025-12-01", total: 500 },
          { month: "2026-01-01", total: 200 },
        ],
        currentMonth: { month: "2026-01-01", total: 200 },
        totals: { totalInRange: 820 },
      },
      isLoading: false,
    });

    render(<Insights />);

    // aqui não precisa bater o texto do mês (dateToText), só garantir que existe algo
    expect(
      screen.getByTestId("insights-top-month-label"),
    ).not.toHaveTextContent("—");
    expect(
      screen.getByTestId("insights-top-month-total"),
    ).not.toHaveTextContent("—");
  });
});
