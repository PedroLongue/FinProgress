import { BillsList } from ".";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { billsMock } from "../../../mocks/bills.mock";

const updateMutateAsyncMock = vi.fn().mockResolvedValue(undefined);
const deleteMutateAsyncMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/hooks/useBills", () => ({
  useBill: vi.fn(),
  useBillDetails: vi.fn(),
  useBillsActions: () => ({
    updateBill: { mutateAsync: updateMutateAsyncMock, isPending: false },
    deleteBill: { mutateAsync: deleteMutateAsyncMock, isPending: false },
  }),
}));

let receivedOptions: { value: string; label: string }[] = [];

vi.mock("../../ui/app-select", () => ({
  AppSelect: (props: {
    ariaLabel: string;
    options: { value: string; label: string }[];
  }) => {
    if (props.ariaLabel === "Filtrar por categoria") {
      receivedOptions = props.options;
    }
    return <div data-testid="mocked-select" />;
  },
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

    expect(screen.getAllByTestId(/bill-row-/)).toHaveLength(billsMock.length);
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

  it("should handle pagination correctly", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <BillsList
        bills={{
          bills: billsMock,
          page: 1,
          pageSize: 10,
          total: 20,
          totalPages: 2,
          userCategories: [],
        }}
        isEmpty={false}
        onPageChange={onPageChange}
      />,
    );

    expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();

    await user.click(screen.getByTestId("next-page-button"));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByText("Página 2 de 2")).toBeInTheDocument();

    await user.click(screen.getByTestId("previous-page-button"));
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.getByText("Página 1 de 2")).toBeInTheDocument();
  });

  it("should handle bill edit correctly", async () => {
    const user = userEvent.setup();

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

    await user.click(screen.getByTestId(`bill-row-${billsMock[0].id}`));

    expect(
      screen.getByTestId(`bill-editModal-${billsMock[0].id}`),
    ).toBeInTheDocument();

    const titleInput = screen.getByTestId("title-edit-input");
    await user.clear(titleInput);
    await user.type(titleInput, "Novo título");

    await user.click(screen.getByTestId("save-button"));

    await waitFor(() => {
      expect(updateMutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(updateMutateAsyncMock).toHaveBeenCalledWith({
        id: billsMock[0].id,
        body: expect.objectContaining({
          title: "Novo título",
        }),
      });
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(`bill-editModal-${billsMock[0].id}`),
      ).not.toBeInTheDocument();
    });
  });

  it("should cancel edit modal without calling update", async () => {
    const user = userEvent.setup();

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

    await user.click(screen.getByTestId(`bill-row-${billsMock[0].id}`));
    await user.click(screen.getByTestId("cancel-button"));

    expect(updateMutateAsyncMock).not.toHaveBeenCalled();
    expect(
      screen.queryByTestId(`bill-editModal-${billsMock[0].id}`),
    ).not.toBeInTheDocument();
  });

  it("should handle bill delete correctly", async () => {
    const user = userEvent.setup();
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

    await user.click(
      screen.getByTestId(`delete-bill-button-${billsMock[0].id}`),
    );
    await user.click(screen.getByTestId("confirm-delete-button"));

    await waitFor(() => {
      expect(deleteMutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(deleteMutateAsyncMock).toHaveBeenCalledWith(billsMock[0].id);
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId(`bill-deleteModal-${billsMock[0].id}`),
      ).not.toBeInTheDocument();
    });
  });

  it("should cancel delete modal without calling delete", async () => {
    const user = userEvent.setup();
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

    await user.click(
      screen.getByTestId(`delete-bill-button-${billsMock[0].id}`),
    );
    await user.click(screen.getByTestId("cancel-delete-button"));

    expect(deleteMutateAsyncMock).not.toHaveBeenCalled();
    expect(
      screen.queryByTestId(`bill-deleteModal-${billsMock[0].id}`),
    ).not.toBeInTheDocument();
  });

  it("should open filter modal when filter button is clicked", async () => {
    const user = userEvent.setup();
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

    await user.click(screen.getByTestId("open-date-filter-button"));

    expect(screen.getByTestId("date-filter-modal")).toBeInTheDocument();
  });

  it("should build categoryOptions from userCategories", () => {
    render(
      <BillsList
        bills={{
          bills: billsMock,
          page: 1,
          pageSize: 10,
          total: billsMock.length,
          totalPages: 1,
          userCategories: ["Energia", "Internet"],
        }}
        isEmpty={false}
        dashpage={false}
      />,
    );

    expect(receivedOptions).toEqual([
      { value: "Energia", label: "Energia" },
      { value: "Internet", label: "Internet" },
    ]);
  });
});
