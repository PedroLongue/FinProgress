import { render, screen } from "@testing-library/react";
import { Bills } from ".";
import { billsMock } from "../../mocks/bills.mock";

const useBillsMock = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/useBills", () => ({
  useBill: useBillsMock,
  useBillsActions: () => ({
    updateBill: { mutateAsync: vi.fn(), isPending: false },
    deleteBill: { mutateAsync: vi.fn(), isPending: false },
  }),
}));

describe("Bills Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing", () => {
    useBillsMock.mockReturnValue({
      bills: { bills: billsMock, totalPages: 1, page: 1 },
      isLoading: false,
      isError: false,
    });

    render(<Bills />);
    expect(screen.getByTestId("bills-page")).toBeInTheDocument();
  });

  it("should render list when bills exist", () => {
    useBillsMock.mockReturnValue({
      bills: { bills: billsMock, totalPages: 1, page: 1 },
      isLoading: false,
      isError: false,
    });

    render(<Bills />);

    expect(screen.getAllByTestId(/bill-row/i).length).toBeGreaterThan(0);
  });

  it("should render empty state when there are no bills", () => {
    useBillsMock.mockReturnValue({
      bills: { bills: [], totalPages: 1, page: 1 },
      isLoading: false,
      isError: false,
    });

    render(<Bills />);

    expect(screen.getByTestId("empty-state-title")).toBeInTheDocument();
    expect(screen.getByTestId("empty-state-description")).toBeInTheDocument();
  });

  it("should render loading state", () => {
    useBillsMock.mockReturnValue({
      bills: undefined,
      isLoading: true,
      isError: false,
    });

    render(<Bills />);

    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });
});
