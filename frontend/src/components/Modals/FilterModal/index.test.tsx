import { render, screen, waitFor } from "@testing-library/react";
import { FilterModal } from ".";
import userEvent from "@testing-library/user-event";

const onApllyMock = vi.fn();
const onCloseMock = vi.fn();
const isLoadingMock = false;

describe("FilterModal Component", () => {
  beforeEach(() => {
    render(
      <FilterModal
        OnAplly={onApllyMock}
        onClose={onCloseMock}
        isLoading={isLoadingMock}
      />,
    );
  });

  it("should render component without crashing", () => {
    expect(screen.getByTestId("date-filter-modal")).toBeInTheDocument();
  });

  it("should render error messages when form is submitted with empty fields", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId("filter-modal-apply-button"));

    await waitFor(() => {
      expect(screen.getByTestId("start-date-error")).toBeInTheDocument();
      expect(screen.getByTestId("end-date-error")).toBeInTheDocument();
    });
  });

  it("should clear the form when the button is clicked", async () => {
    const user = userEvent.setup();

    await user.type(screen.getByTestId("start-date-input"), "2024-01-01");
    await user.type(screen.getByTestId("end-date-input"), "2024-01-31");

    await user.click(screen.getByTestId("filter-modal-clear-button"));

    await waitFor(() => {
      expect(screen.getByTestId("start-date-input")).toHaveValue("");
      expect(screen.getByTestId("end-date-input")).toHaveValue("");
    });
  });

  it("should call onAplly with correct data when form is submitted", async () => {
    const user = userEvent.setup();

    await user.type(screen.getByTestId("start-date-input"), "2024-01-01");
    await user.type(screen.getByTestId("end-date-input"), "2024-01-31");

    await user.click(screen.getByTestId("filter-modal-apply-button"));

    await waitFor(() => {
      expect(onApllyMock).toHaveBeenCalledWith({
        startDate: "2024-01-01",
        endDate: "2024-01-31",
      });
    });
  });
});
