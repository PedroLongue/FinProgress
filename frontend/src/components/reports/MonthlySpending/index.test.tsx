import { render, screen } from "@testing-library/react";
import { MonthlySpending } from ".";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";

type TooltipCallbacks = {
  title: (items: TooltipItem<"bar">[]) => string;
  label: (item: TooltipItem<"bar">) => string;
  afterLabel: (item: TooltipItem<"bar">) => string;
};

let capturedProps: {
  options: ChartOptions<"bar">;
  data: ChartData<"bar", number[], string>;
} | null = null;

vi.mock("react-chartjs-2", () => ({
  Bar: (props: {
    options: ChartOptions<"bar">;
    data: ChartData<"bar", number[], string>;
  }) => {
    capturedProps = props;
    return <div data-testid="bar-chart-stub" />;
  },
}));

vi.mock("chart.js", () => ({
  Chart: { register: vi.fn() },
  BarElement: {},
  CategoryScale: {},
  LinearScale: {},
  Tooltip: {},
  Legend: {},
}));

vi.mock("@/utils/bills.utils", () => ({
  formatCurrency: (value: number) => `R$ ${value}`,
}));

describe("MonthlySpending Report Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedProps = null;
  });

  const mockSpendingReportData = {
    rangeMonths: 3 as const,
    currentMonth: { month: "2026-02-01", total: 300, count: 2 },
    totals: { totalInRange: 1350, monthsCount: 2 },
    byMonth: [
      { month: "2025-12-01", total: 400, count: 2 },
      { month: "2026-01-01", total: 650, count: 3 },
    ],
  };

  it("should render monthlySpending component without crashing", () => {
    render(
      <MonthlySpending
        spendingReportData={mockSpendingReportData}
        monthFilter={3}
        setMonthFilter={vi.fn()}
        isEmpty={false}
      />,
    );

    expect(
      screen.getByTestId("monthly-spending-component"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart-stub")).toBeInTheDocument();
  });

  it("should render empty state when isEmpty is true", () => {
    const emptySpendingReportData = {
      rangeMonths: 3 as const,
      currentMonth: { month: "", total: 0, count: 0 },
      totals: { totalInRange: 0, monthsCount: 0 },
      byMonth: [],
    };

    render(
      <MonthlySpending
        spendingReportData={emptySpendingReportData}
        monthFilter={3}
        setMonthFilter={vi.fn()}
        isEmpty={true}
      />,
    );

    expect(
      screen.getByTestId("monthly-spending-component"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("empty-reports-state")).toBeInTheDocument();
    expect(screen.queryByTestId("bar-chart-stub")).not.toBeInTheDocument();
  });

  it("should transform data correctly", () => {
    render(
      <MonthlySpending
        spendingReportData={mockSpendingReportData}
        monthFilter={3}
        setMonthFilter={vi.fn()}
        isEmpty={false}
      />,
    );

    expect(capturedProps?.data.labels).toEqual(["12/2025", "01/2026"]);
    expect(capturedProps?.data.datasets[0].data).toEqual([400, 650]);
  });

  describe("tooltip callbacks", () => {
    const getCallbacks = () => {
      const callbacks = capturedProps?.options.plugins?.tooltip?.callbacks;
      if (!callbacks) {
        throw new Error("Tooltip callbacks not found");
      }
      return callbacks as TooltipCallbacks;
    };

    const createMockTooltipItem = (
      label: string,
      parsedY: number,
      dataIndex: number,
    ): TooltipItem<"bar"> => {
      return {
        dataset: { label: "Gasto (R$)" } as { label: string },
        parsed: { y: parsedY } as { y: number },
        dataIndex,
        datasetIndex: 0,
        label,
        formattedValue: "",
        raw: parsedY,
      } as TooltipItem<"bar">;
    };

    it("should format title correctly", () => {
      render(
        <MonthlySpending
          spendingReportData={mockSpendingReportData}
          monthFilter={3}
          setMonthFilter={vi.fn()}
          isEmpty={false}
        />,
      );

      const callbacks = getCallbacks();
      const items = [{ label: "Dez/25" }] as TooltipItem<"bar">[];
      const titleResult = callbacks.title(items);
      expect(titleResult).toBe("Dez/25");
    });

    it("should format label correctly", () => {
      render(
        <MonthlySpending
          spendingReportData={mockSpendingReportData}
          monthFilter={3}
          setMonthFilter={vi.fn()}
          isEmpty={false}
        />,
      );

      const callbacks = getCallbacks();
      const mockItem = createMockTooltipItem("Dez/25", 400, 0);
      const labelResult = callbacks.label(mockItem);
      expect(labelResult).toBe("Gasto: R$ 400");
    });

    describe("afterLabel", () => {
      it("should format afterLabel correctly with singular", () => {
        const spendingReportDataWithSingleCount = {
          ...mockSpendingReportData,
          byMonth: [{ month: "2025-12-01", total: 400, count: 1 }],
        };

        render(
          <MonthlySpending
            spendingReportData={spendingReportDataWithSingleCount}
            monthFilter={3}
            setMonthFilter={vi.fn()}
            isEmpty={false}
          />,
        );

        const callbacks = getCallbacks();
        const mockItem = createMockTooltipItem("Dez/25", 400, 0);
        const result = callbacks.afterLabel(mockItem);
        expect(result).toBe("Qtd: 1 conta");
      });

      it("should format afterLabel correctly with plural", () => {
        const spendingReportDataWithMultipleCounts = {
          ...mockSpendingReportData,
          byMonth: [{ month: "2025-12-01", total: 400, count: 3 }],
        };

        render(
          <MonthlySpending
            spendingReportData={spendingReportDataWithMultipleCounts}
            monthFilter={3}
            setMonthFilter={vi.fn()}
            isEmpty={false}
          />,
        );

        const callbacks = getCallbacks();
        const mockItem = createMockTooltipItem("Dez/25", 400, 0);
        const result = callbacks.afterLabel(mockItem);
        expect(result).toBe("Qtd: 3 contas");
      });
    });
  });
});
