import { BillsList } from ".";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { billsMock } from "../../../mocks/bills.mock";

vi.mock("@/hooks/useBills", () => ({
  useBill: vi.fn(),
  useBillDetails: vi.fn(),
  useBillsActions: () => ({
    updateBill: { mutateAsync: vi.fn(), isPending: false },
    deleteBill: { mutateAsync: vi.fn(), isPending: false },
  }),
}));

describe("BillList component", () => {
  it("should render empty state without crashing", () => {
    render(
      <BillsList
        bills={{
          bills: [],
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
          userCategories: [],
        }}
        isEmpty={true}
      />,
    );

    expect(screen.getByTestId("empty-state-title")).toBeInTheDocument();
    expect(screen.getByTestId("empty-state-description")).toBeInTheDocument();
  });

  it("should render bills list without crashing", () => {
    render(
      <BillsList
        bills={{
          bills: billsMock,
          page: 1,
          pageSize: 10,
          total: billsMock.length,
          totalPages: 1,
          userCategories: [],
        }}
        isEmpty={false}
      />,
    );

    expect(screen.getByText("Boletos")).toBeInTheDocument();
    expect(screen.getAllByTestId("bill-row")).toHaveLength(billsMock.length);
    expect(screen.getByText(billsMock[0].title)).toBeInTheDocument();
  });

  it("should open edit modal when a bill row is clicked", async () => {
    render(
      <BillsList
        bills={{
          bills: billsMock,
          page: 1,
          pageSize: 10,
          total: billsMock.length,
          totalPages: 1,
          userCategories: [],
        }}
        isEmpty={false}
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByText(billsMock[0].title));

    expect(
      screen.getByTestId(`bill-editModal-${billsMock[0].id}`),
    ).toBeInTheDocument();
  });

  it("should open delete modal when delete button is clicked", async () => {
    render(
      <BillsList
        bills={{
          bills: billsMock,
          page: 1,
          pageSize: 10,
          total: billsMock.length,
          totalPages: 1,
          userCategories: [],
        }}
        isEmpty={false}
      />,
    );

    const user = userEvent.setup();
    await user.click(
      screen.getByTestId(`delete-bill-button-${billsMock[0].id}`),
    );

    expect(
      screen.getByTestId(`bill-deleteModal-${billsMock[0].id}`),
    ).toBeInTheDocument();
  });
});
