import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateOrupdateGoalModal } from ".";

const onSaveMock = vi.fn();
const onCloseMock = vi.fn();

describe("CreateOrupdateGoalModal Component", () => {
  it("should render without crashing", () => {
    render(
      <CreateOrupdateGoalModal
        mode="create"
        goal={2500}
        isLoading={false}
        onSave={onSaveMock}
        onClose={onCloseMock}
      />,
    );

    expect(screen.getByTestId("goal-modal")).toBeInTheDocument();
    expect(screen.getByTestId("goal-modal-title")).toHaveTextContent(/crie/i);

    const input = screen.getByTestId("goal-amount-input") as HTMLInputElement;
    expect(input.value).toBe("2500");
  });

  it("should render correct title in update mode", () => {
    render(
      <CreateOrupdateGoalModal
        mode="update"
        goal={1000}
        isLoading={false}
        onSave={onSaveMock}
        onClose={onCloseMock}
      />,
    );

    expect(screen.getByTestId("goal-modal-title")).toHaveTextContent(
      /atualize/i,
    );
  });

  it("should call onClose when clicking Cancel", async () => {
    const user = userEvent.setup();

    render(
      <CreateOrupdateGoalModal
        mode="create"
        goal={0}
        isLoading={false}
        onSave={onSaveMock}
        onClose={onCloseMock}
      />,
    );

    await user.click(screen.getByTestId("goal-cancel"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should display error message when submitting empty/invalid input", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(
      <CreateOrupdateGoalModal
        mode="create"
        goal={0}
        isLoading={false}
        onSave={onSave}
        onClose={onClose}
      />,
    );

    const input = screen.getByTestId("goal-amount-input") as HTMLInputElement;
    await user.clear(input);

    await user.click(screen.getByTestId("goal-submit"));

    const err = await screen.findByTestId("goal-amount-error");
    expect(err).toBeInTheDocument();
    expect(err.textContent).toMatch(/.+/);

    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should call onSave with amount (number) and then onClose when valid", async () => {
    const user = userEvent.setup();

    render(
      <CreateOrupdateGoalModal
        mode="update"
        goal={2000}
        isLoading={false}
        onSave={onSaveMock}
        onClose={onCloseMock}
      />,
    );

    const input = screen.getByTestId("goal-amount-input") as HTMLInputElement;

    await user.clear(input);
    await user.type(input, "3000");

    await user.click(screen.getByTestId("goal-submit"));

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledTimes(1);
      expect(onSaveMock).toHaveBeenCalledWith({ amount: 3000 });
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should disable buttons and prevent interaction when isLoading=true", async () => {
    const user = userEvent.setup();

    render(
      <CreateOrupdateGoalModal
        mode="update"
        goal={2000}
        isLoading={true}
        onSave={onSaveMock}
        onClose={onCloseMock}
      />,
    );

    expect(screen.getByTestId("goal-cancel")).toBeDisabled();
    expect(screen.getByTestId("goal-submit")).toBeDisabled();

    await user.click(screen.getByTestId("goal-cancel"));
    expect(onCloseMock).not.toHaveBeenCalled();

    await user.click(screen.getByTestId("goal-submit"));
    expect(onSaveMock).not.toHaveBeenCalled();
  });
});
