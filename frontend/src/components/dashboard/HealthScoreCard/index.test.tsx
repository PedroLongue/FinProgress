import { render, screen } from "@testing-library/react";
import { HealthScoreCard } from ".";
import userEvent from "@testing-library/user-event";

vi.mock("@/hooks/useBills", () => ({
  useBillExplanation: vi.fn(() => ({
    scoreExplanation: {
      scoreExplanation: {
        title: "",
        summary: "",
        bills: [],
        nextSteps: [],
      },
    },
    isLoading: false,
  })),
}));

describe("HealthScoreCard Component", () => {
  it("should render empty state without crashing", () => {
    render(<HealthScoreCard score={0} isLoading={false} isEmpty={true} />);

    expect(
      screen.getByTestId("empty-state-health-description"),
    ).toBeInTheDocument();
  });

  it("should render score without crashing - 85%", () => {
    render(<HealthScoreCard score={85} isLoading={false} isEmpty={false} />);

    expect(screen.getByText("Excelente")).toBeInTheDocument();
  });
  it("should render score without crashing - 65%", () => {
    render(<HealthScoreCard score={65} isLoading={false} isEmpty={false} />);

    expect(screen.getByText("Bom")).toBeInTheDocument();
  });

  it("should render score without crashing - 50%", () => {
    render(<HealthScoreCard score={50} isLoading={false} isEmpty={false} />);

    expect(screen.getByText("Regular")).toBeInTheDocument();
  });

  it("should render score without crashing - 20%", () => {
    render(<HealthScoreCard score={20} isLoading={false} isEmpty={false} />);

    expect(screen.getByText("Atenção")).toBeInTheDocument();
  });

  it("should open datils modal when is clicked", async () => {
    render(<HealthScoreCard score={85} isLoading={false} isEmpty={false} />);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("details-button"));

    expect(screen.getByTestId("score-details-modal")).toBeInTheDocument();
  });
});
