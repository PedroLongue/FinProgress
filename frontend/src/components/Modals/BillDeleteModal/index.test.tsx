import { render, screen, fireEvent } from "@testing-library/react";
import { BillDeleteModal } from ".";
import { billsMock } from "../../../mocks/bills.mock";

const mockOnClose = vi.fn();
const mockOnDelete = vi.fn();

const { useOnClickOutsideMock } = vi.hoisted(() => ({
  useOnClickOutsideMock: vi.fn(),
}));

vi.mock("@/hooks/useOnClickOutside", () => ({
  useOnClickOutside: useOnClickOutsideMock,
}));

describe("BillDeleteModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render modal with bill title", () => {
    render(
      <BillDeleteModal
        bill={billsMock[0]}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );

    expect(
      screen.getByTestId(`bill-deleteModal-${billsMock[0].id}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Excluir "${billsMock[0].title}"?`),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Esta ação não pode ser desfeita."),
    ).toBeInTheDocument();
  });

  it("should call onClose when cancel button is clicked", () => {
    render(
      <BillDeleteModal
        bill={billsMock[0]}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );

    const cancelButton = screen.getByTestId("cancel-delete-button");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it("should call onDelete and onClose when confirm button is clicked", async () => {
    mockOnDelete.mockResolvedValueOnce(undefined);

    render(
      <BillDeleteModal
        bill={billsMock[0]}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );

    const confirmButton = screen.getByTestId("confirm-delete-button");
    fireEvent.click(confirmButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(billsMock[0].id);

    await vi.waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should not call onDelete when onDelete is not provided", () => {
    render(<BillDeleteModal bill={billsMock[0]} onClose={mockOnClose} />);

    const confirmButton = screen.getByTestId("confirm-delete-button");
    fireEvent.click(confirmButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should disable buttons when isLoading is true", () => {
    render(
      <BillDeleteModal
        bill={billsMock[0]}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
        isLoading={true}
      />,
    );

    const cancelButton = screen.getByTestId("cancel-delete-button");
    const confirmButton = screen.getByTestId("confirm-delete-button");

    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
    expect(confirmButton).toHaveTextContent("Excluindo...");
  });

  it("should call onClose when clicking outside (via hook)", () => {
    render(
      <BillDeleteModal
        bill={billsMock[0]}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );

    const callback = useOnClickOutsideMock.mock.calls[0][1];

    const mockEvent = new MouseEvent("mousedown");
    callback(mockEvent);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
