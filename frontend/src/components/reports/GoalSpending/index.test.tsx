import { render, screen } from "@testing-library/react";
import { GoalSpending } from ".";
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

describe("GoalSpending Report Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedProps = null;
  });

  it("should render goalSpending component without crashing", () => {
    const rows = [
      { month: "2025-12-01", goalAmount: 500, spent: 400 },
      { month: "2026-01-01", goalAmount: 600, spent: 650 },
    ];

    render(
      <GoalSpending
        rows={rows}
        monthFilter={3}
        setMonthFilter={vi.fn()}
        isEmpty={false}
      />,
    );

    expect(screen.getByTestId("goal-spending-component")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart-stub")).toBeInTheDocument();
  });

  it("should render empty state when isEmpty is true", () => {
    render(
      <GoalSpending
        rows={[]}
        monthFilter={3}
        setMonthFilter={vi.fn()}
        isEmpty={true}
      />,
    );

    expect(screen.getByTestId("goal-spending-component")).toBeInTheDocument();
    expect(screen.getByTestId("empty-reports-state")).toBeInTheDocument();
    expect(screen.queryByTestId("bar-chart-stub")).not.toBeInTheDocument();
  });

  it("should transform data correctly", () => {
    const rows = [
      { month: "2025-12-01", goalAmount: 500, spent: 400 },
      { month: "2026-01-01", goalAmount: 600, spent: 650 },
    ];

    render(
      <GoalSpending
        rows={rows}
        monthFilter={3}
        setMonthFilter={vi.fn()}
        isEmpty={false}
      />,
    );

    expect(capturedProps?.data.labels).toEqual(["12/2025", "01/2026"]);
    expect(capturedProps?.data.datasets[0].data).toEqual([400, 650]);
    expect(capturedProps?.data.datasets[1].data).toEqual([500, 600]);
  });

  it("should calculate bar colors correctly based on spent vs goal", () => {
    const rows = [
      { month: "2025-12-01", goalAmount: 500, spent: 300 },
      { month: "2026-01-01", goalAmount: 600, spent: 650 },
    ];

    render(
      <GoalSpending
        rows={rows}
        monthFilter={3}
        setMonthFilter={vi.fn()}
        isEmpty={false}
      />,
    );

    const goalDataset = capturedProps?.data.datasets[1];
    expect(goalDataset?.backgroundColor).toEqual(["#22c55e", "#ef4444"]);
    expect(goalDataset?.borderColor).toEqual(["#166534", "#b91c1c"]);
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
      datasetLabel: string,
      parsedX: number,
      dataIndex: number,
    ): TooltipItem<"bar"> => {
      return {
        dataset: { label: datasetLabel } as { label: string },
        parsed: { x: parsedX } as { x: number },
        dataIndex,
        datasetIndex: datasetLabel === "Gasto (R$)" ? 0 : 1,
        label: "",
        formattedValue: "",
        raw: parsedX,
      } as TooltipItem<"bar">;
    };

    it("should format title correctly", () => {
      const rows = [{ month: "2025-12-01", goalAmount: 500, spent: 400 }];

      render(
        <GoalSpending
          rows={rows}
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

    it("should format label for spent dataset", () => {
      const rows = [{ month: "2025-12-01", goalAmount: 500, spent: 400 }];

      render(
        <GoalSpending
          rows={rows}
          monthFilter={3}
          setMonthFilter={vi.fn()}
          isEmpty={false}
        />,
      );

      const callbacks = getCallbacks();
      const mockItem = createMockTooltipItem("Gasto (R$)", 400, 0);
      const labelResult = callbacks.label(mockItem);
      expect(labelResult).toBe("Gasto: R$ 400");
    });

    it("should format label for goal dataset with valid goal", () => {
      const rows = [{ month: "2025-12-01", goalAmount: 500, spent: 400 }];

      render(
        <GoalSpending
          rows={rows}
          monthFilter={3}
          setMonthFilter={vi.fn()}
          isEmpty={false}
        />,
      );

      const callbacks = getCallbacks();
      const mockItem = createMockTooltipItem("Meta (R$)", 500, 0);
      const labelResult = callbacks.label(mockItem);
      expect(labelResult).toBe("Meta: R$ 500");
    });

    it("should format label for goal dataset without goal", () => {
      const rows = [{ month: "2025-12-01", goalAmount: 0, spent: 400 }];

      render(
        <GoalSpending
          rows={rows}
          monthFilter={3}
          setMonthFilter={vi.fn()}
          isEmpty={false}
        />,
      );

      const callbacks = getCallbacks();
      const mockItem = createMockTooltipItem("Meta (R$)", 0, 0);
      const labelResult = callbacks.label(mockItem);
      expect(labelResult).toBe("Meta: Sem meta");
    });

    describe("afterLabel", () => {
      it("should return empty string when no goal amount", () => {
        const rows = [{ month: "2025-12-01", goalAmount: 0, spent: 400 }];

        render(
          <GoalSpending
            rows={rows}
            monthFilter={3}
            setMonthFilter={vi.fn()}
            isEmpty={false}
          />,
        );

        const callbacks = getCallbacks();
        const mockItem = createMockTooltipItem("Meta (R$)", 400, 0);
        const result = callbacks.afterLabel(mockItem);
        expect(result).toBe("");
      });

      it("should return 'Limite atingido' when spent >= goal", () => {
        const rows = [{ month: "2025-12-01", goalAmount: 500, spent: 500 }];

        render(
          <GoalSpending
            rows={rows}
            monthFilter={3}
            setMonthFilter={vi.fn()}
            isEmpty={false}
          />,
        );

        const callbacks = getCallbacks();
        const mockItem = createMockTooltipItem("Meta (R$)", 500, 0);
        const result = callbacks.afterLabel(mockItem);
        expect(result).toBe("Limite atingido • 100% usado");
      });

      it("should return 'Próximo do limite' when spent between 80% and 100%", () => {
        const rows = [{ month: "2025-12-01", goalAmount: 500, spent: 450 }];

        render(
          <GoalSpending
            rows={rows}
            monthFilter={3}
            setMonthFilter={vi.fn()}
            isEmpty={false}
          />,
        );

        const callbacks = getCallbacks();
        const mockItem = createMockTooltipItem("Meta (R$)", 450, 0);
        const result = callbacks.afterLabel(mockItem);
        expect(result).toBe("Próximo do limite • 90% usado");
      });

      it("should return 'Ok' when spent below 80%", () => {
        const rows = [{ month: "2025-12-01", goalAmount: 500, spent: 300 }];

        render(
          <GoalSpending
            rows={rows}
            monthFilter={3}
            setMonthFilter={vi.fn()}
            isEmpty={false}
          />,
        );

        const callbacks = getCallbacks();
        const mockItem = createMockTooltipItem("Meta (R$)", 300, 0);
        const result = callbacks.afterLabel(mockItem);
        expect(result).toBe("Ok • 60% usado");
      });

      it("should cap percentage at 999%", () => {
        const rows = [{ month: "2025-12-01", goalAmount: 100, spent: 2000 }];

        render(
          <GoalSpending
            rows={rows}
            monthFilter={3}
            setMonthFilter={vi.fn()}
            isEmpty={false}
          />,
        );

        const callbacks = getCallbacks();
        const mockItem = createMockTooltipItem("Meta (R$)", 2000, 0);
        const result = callbacks.afterLabel(mockItem);
        expect(result).toBe("Limite atingido • 999% usado");
      });
    });
  });
});
