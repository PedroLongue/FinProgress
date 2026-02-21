import { render, screen } from "@testing-library/react";
import { billsMock } from "../../../mocks/bills.mock";
import { BillEditModal } from ".";
import userEvent from "@testing-library/user-event";

const onSaveMock = vi.fn();
const onCloseMock = vi.fn();

describe("BillEditModal Component", () => {
  beforeEach(() => {
    render(
      <BillEditModal
        bill={billsMock[0]}
        onClose={onCloseMock}
        onSave={onSaveMock}
      />,
    );
  });

  it("should render the BillEditModal component without crashing", () => {
    expect(
      screen.getByTestId(`bill-editModal-${billsMock[0].id}`),
    ).toBeInTheDocument();
  });

  it("should render error title is less than 2 characters", async () => {
    const user = userEvent.setup();

    const titleInput = screen.getByTestId("title-edit-input");
    await user.clear(titleInput);
    await user.type(titleInput, "a");

    await user.click(screen.getByTestId("save-button"));

    expect(
      screen.getByText("Título deve ter no mínimo 2 caracteres"),
    ).toBeInTheDocument();
  });

  it("should render error title is more than 50 characters", async () => {
    const user = userEvent.setup();

    const titleInput = screen.getByTestId("title-edit-input");
    await user.clear(titleInput);
    await user.type(
      titleInput,
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus.",
    );

    await user.click(screen.getByTestId("save-button"));

    expect(
      screen.getByText("Título deve ter no máximo 50 caracteres"),
    ).toBeInTheDocument();
  });

  it('should render error when title is empty"', async () => {
    const user = userEvent.setup();

    const titleInput = screen.getByTestId("title-edit-input");
    await user.clear(titleInput);
    await user.click(screen.getByTestId("save-button"));

    expect(screen.getByText("Informe o título")).toBeInTheDocument();
  });

  it('should change status to "PAID" when "Mark as Paid" button is clicked', async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId("mark-as-paid-button"));

    expect(onSaveMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "PAID",
        paidAt: expect.any(String),
      }),
    );
  });
});
