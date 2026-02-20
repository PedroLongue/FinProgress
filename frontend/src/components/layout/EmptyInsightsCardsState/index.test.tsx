import { render, screen } from "@testing-library/react";
import { EmptyInsightsCardsState } from ".";
import userEvent from "@testing-library/user-event";

const onConfigureGoalMock = vi.fn();

const renderEmptyState = (
  props: Partial<React.ComponentProps<typeof EmptyInsightsCardsState>> = {},
) =>
  render(
    <EmptyInsightsCardsState
      type="total"
      title="Empty total insights"
      description="Empty total insights description"
      {...props}
    />,
  );

describe("EmptyInsightsCardsState Component", () => {
  it("should render total insights empty state without crashing", () => {
    renderEmptyState();

    expect(screen.getByText("Empty total insights")).toBeInTheDocument();
    expect(
      screen.getByText("Empty total insights description"),
    ).toBeInTheDocument();
  });

  it("should render goal insights empty state without crashing", async () => {
    renderEmptyState({
      type: "goal",
      title: "Empty goal insights",
      description: "Empty goal insights description",
      onConfigureGoal: onConfigureGoalMock,
    });

    expect(screen.getByText("Empty goal insights")).toBeInTheDocument();
    expect(
      screen.getByText("Empty goal insights description"),
    ).toBeInTheDocument();
    expect(screen.getByText("R$ 0")).toBeInTheDocument();
    expect(screen.getByText("Meta não definida")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByTestId("configure-goal-button"));

    expect(onConfigureGoalMock).toHaveBeenCalled();
  });

  it("should render volume insights empty state without crashing", () => {
    renderEmptyState({
      type: "volume",
      title: "Empty volume insights",
      description: "Empty volume insights description",
    });
    expect(screen.getByText("Empty volume insights")).toBeInTheDocument();
    expect(
      screen.getByText("Empty volume insights description"),
    ).toBeInTheDocument();
  });
});
