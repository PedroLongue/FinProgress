import { render, screen } from "@testing-library/react";
import { billsMock } from "../../mocks/bills.mock";
import { Dashboard } from ".";

const useBillMock = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/useBills", () => ({
  useBill: useBillMock,
  useBillDetails: () => ({
    billDetails: { score: 80, totalBills: 5, totalPending: 2 },
    isLoading: false,
    isError: false,
  }),
  useBillsActions: () => ({
    updateBill: { mutateAsync: vi.fn(), isPending: false },
    deleteBill: { mutateAsync: vi.fn(), isPending: false },
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { name: "Pedro" } }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("Dashboard Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useBillMock.mockReturnValue({
      bills: {
        bills: billsMock,
        page: 1,
        pageSize: 10,
        total: billsMock.length,
        totalPages: 1,
        userCategories: [],
      },
      isLoading: false,
      isError: false,
    });
  });

  it("should render the dashboard page without crashing", async () => {
    render(<Dashboard />);

    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    expect(screen.getByText(/Olá,\s*Pedro/i)).toBeInTheDocument();
  });

  it("should render loading when bills are loading", async () => {
    useBillMock.mockReturnValueOnce({
      bills: undefined,
      isLoading: true,
      isError: false,
    });

    render(<Dashboard />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });
});
