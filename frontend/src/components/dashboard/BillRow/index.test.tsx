import { render, screen } from "@testing-library/react";
import { BillRow } from "./index";
import { billsMock } from "../../../mocks/bills.mock";
import { formatDate } from "../../../utils/date.utils";
import { userEvent } from "@testing-library/user-event/dist/cjs/setup/index.js";

const onEditMock = vi.fn();
const onDeleteMock = vi.fn();

describe("BillRow component", () => {
  beforeEach(() => {
    render(
      <BillRow
        bill={billsMock[0]}
        index={0}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />,
    );
  });

  it("should render without crashing", () => {
    const dueDateText = formatDate(billsMock[0].dueDate);

    expect(screen.getByText(billsMock[0].title)).toBeInTheDocument();
    expect(screen.getByText("R$ 189,90")).toBeInTheDocument();
    expect(screen.getByText(dueDateText)).toBeInTheDocument();
    expect(screen.getByText(billsMock[0].category!)).toBeInTheDocument();
    expect(screen.getByText(billsMock[0].description!)).toBeInTheDocument();
    expect(
      screen.getByTestId(`status-icon-${billsMock[0].status}`),
    ).toBeInTheDocument();
  });

  it("should call onEdit when clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText(billsMock[0].title));

    expect(onEditMock).toHaveBeenCalledWith(billsMock[0]);
    expect(onDeleteMock).not.toHaveBeenCalled();
  });

  it("should call onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    screen.logTestingPlaygroundURL();
    await user.click(
      screen.getByTestId(`delete-bill-button-${billsMock[0].id}`),
    );

    expect(onDeleteMock).toHaveBeenCalledWith(billsMock[0]);
    expect(onEditMock).not.toHaveBeenCalled();
  });
});
