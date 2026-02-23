import { render, screen } from "@testing-library/react";
import { SpendingByCategory } from ".";
import type { ChartData, ChartOptions, TooltipItem } from "chart.js";

type TooltipCallbacks = {
  title: (items: TooltipItem<"pie">[]) => string;
  label: (item: TooltipItem<"pie">) => string;
  afterLabel: (item: TooltipItem<"pie">) => string;
};

let capturedProps: {
  options: ChartOptions<"pie">;
  data: ChartData<"pie", number[], string>;
} | null = null;

vi.mock("react-chartjs-2", () => ({
  Pie: (props: {
    options: ChartOptions<"pie">;
    data: ChartData<"pie", number[], string>;
  }) => {
    capturedProps = props;
    return <div data-testid="pie-chart-stub" />;
  },
}));

vi.mock("chart.js", () => ({
  Chart: { register: vi.fn() },
  ArcElement: {},
  Tooltip: {},
  Legend: {},
}));

vi.mock("@/utils/bills.utils", () => ({
  formatCurrency: (value: number) => `R$ ${value}`,
}));

vi.mock("@/utils/date.utils", () => ({
  dateInputToISO: vi.fn((date) => date),
  isoToDateInput: vi.fn((date) => date),
}));

describe("SpendingByCategory Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedProps = null;
  });

  const mockSpendingByCategoryData = {
    range: {
      start: "2026-01-01",
      end: "2026-01-31",
    },
    totals: {
      totalInRange: 2850,
      categoriesCount: 3,
    },
    byCategory: [
      { category: "Alimentação", total: 1500, count: 5 },
      { category: "Transporte", total: 850, count: 2 },
      { category: "Lazer", total: 500, count: 1 },
    ],
  };

  it("should render spendingByCategory component without crashing", () => {
    render(
      <SpendingByCategory
        spendingReportByCategoryData={mockSpendingByCategoryData}
        onChangeRange={vi.fn()}
        isEmpty={false}
      />,
    );

    expect(
      screen.getByTestId("spending-by-category-component"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("pie-chart-stub")).toBeInTheDocument();
  });

  it("should render empty state when isEmpty is true", () => {
    const emptySpendingByCategoryData = {
      range: {
        start: "",
        end: "",
      },
      totals: {
        totalInRange: 0,
        categoriesCount: 0,
      },
      byCategory: [],
    };

    render(
      <SpendingByCategory
        spendingReportByCategoryData={emptySpendingByCategoryData}
        onChangeRange={vi.fn()}
        isEmpty={true}
      />,
    );

    expect(
      screen.getByTestId("spending-by-category-component"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("empty-reports-state")).toBeInTheDocument();
    expect(screen.queryByTestId("pie-chart-stub")).not.toBeInTheDocument();
  });

  it("should transform data correctly", () => {
    render(
      <SpendingByCategory
        spendingReportByCategoryData={mockSpendingByCategoryData}
        onChangeRange={vi.fn()}
        isEmpty={false}
      />,
    );

    expect(capturedProps?.data.labels).toEqual([
      "Alimentação",
      "Transporte",
      "Lazer",
    ]);
    expect(capturedProps?.data.datasets[0].data).toEqual([1500, 850, 500]);
  });

  it("should generate colors correctly", () => {
    render(
      <SpendingByCategory
        spendingReportByCategoryData={mockSpendingByCategoryData}
        onChangeRange={vi.fn()}
        isEmpty={false}
      />,
    );

    const colors = capturedProps?.data.datasets[0].backgroundColor;
    expect(colors).toEqual(["#3c83f6", "#10b77f", "#f28f07"]);
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
      parsed: number,
      dataIndex: number,
    ): TooltipItem<"pie"> => {
      return {
        dataset: { label: "Gasto por categoria" } as { label: string },
        parsed,
        dataIndex,
        datasetIndex: 0,
        label,
        formattedValue: "",
        raw: parsed,
      } as TooltipItem<"pie">;
    };

    it("should format title correctly", () => {
      render(
        <SpendingByCategory
          spendingReportByCategoryData={mockSpendingByCategoryData}
          onChangeRange={vi.fn()}
          isEmpty={false}
        />,
      );

      const callbacks = getCallbacks();
      const items = [{ label: "Alimentação" }] as TooltipItem<"pie">[];
      const titleResult = callbacks.title(items);
      expect(titleResult).toBe("Alimentação");
    });

    it("should format label correctly with percentage", () => {
      render(
        <SpendingByCategory
          spendingReportByCategoryData={mockSpendingByCategoryData}
          onChangeRange={vi.fn()}
          isEmpty={false}
        />,
      );

      const callbacks = getCallbacks();
      const mockItem = createMockTooltipItem("Alimentação", 1500, 0);
      const labelResult = callbacks.label(mockItem);
      expect(labelResult).toBe("Valor: R$ 1500 (52,63%)");
    });

    it("should handle zero totalInRange in label", () => {
      const dataWithZeroTotal = {
        ...mockSpendingByCategoryData,
        totals: { totalInRange: 0, categoriesCount: 3 },
      };

      render(
        <SpendingByCategory
          spendingReportByCategoryData={dataWithZeroTotal}
          onChangeRange={vi.fn()}
          isEmpty={false}
        />,
      );

      const callbacks = getCallbacks();
      const mockItem = createMockTooltipItem("Alimentação", 1500, 0);
      const labelResult = callbacks.label(mockItem);
      expect(labelResult).toBe("Valor: R$ 1500 (0%)");
    });

    describe("afterLabel", () => {
      it("should format afterLabel correctly with singular", () => {
        render(
          <SpendingByCategory
            spendingReportByCategoryData={mockSpendingByCategoryData}
            onChangeRange={vi.fn()}
            isEmpty={false}
          />,
        );

        const callbacks = getCallbacks();
        const mockItem = createMockTooltipItem("Lazer", 500, 2);
        const result = callbacks.afterLabel(mockItem);
        expect(result).toBe("Qtd: 1 conta");
      });

      it("should format afterLabel correctly with plural", () => {
        render(
          <SpendingByCategory
            spendingReportByCategoryData={mockSpendingByCategoryData}
            onChangeRange={vi.fn()}
            isEmpty={false}
          />,
        );

        const callbacks = getCallbacks();
        const mockItem = createMockTooltipItem("Alimentação", 1500, 0);
        const result = callbacks.afterLabel(mockItem);
        expect(result).toBe("Qtd: 5 contas");
      });

      it("should handle zero count in afterLabel", () => {
        const dataWithZeroCount = {
          ...mockSpendingByCategoryData,
          byCategory: [{ category: "Teste", total: 100, count: 0 }],
        };

        render(
          <SpendingByCategory
            spendingReportByCategoryData={dataWithZeroCount}
            onChangeRange={vi.fn()}
            isEmpty={false}
          />,
        );

        const callbacks = getCallbacks();
        const mockItem = createMockTooltipItem("Teste", 100, 0);
        const result = callbacks.afterLabel(mockItem);
        expect(result).toBe("Qtd: 0 contas");
      });
    });
  });
});
