import { render, screen } from "@testing-library/react";
import { ScoreDetailsModal } from ".";
import userEvent from "@testing-library/user-event";

const onCloseMock = vi.fn();
vi.mock("@/hooks/useBills", () => ({
  useBillExplanation: () => ({
    scoreExplanation: {
      scoreExplanation: {
        title: "Explicação do Score",
        summary: "Esta é a explicação do score.",
        bills: ["6 boletos pagos em dia", "2 boletos atrasados"],
        nextSteps: [
          "não pague boletos atrasados",
          "considere evitar novos atrasos",
        ],
      },
    },
  }),
}));

describe("HealthScoreExplanationModal Component", () => {
  beforeEach(() => {
    render(<ScoreDetailsModal onClose={onCloseMock} />);
  });
  it("should render component without crashing", () => {
    expect(screen.getByTestId("score-details-modal")).toBeInTheDocument();
  });

  it("should render score explanation title and summary", () => {
    expect(screen.getByText("Explicação do Score")).toBeInTheDocument();
    expect(
      screen.getByText("Esta é a explicação do score."),
    ).toBeInTheDocument();
    expect(screen.getByText("6 boletos pagos em dia")).toBeInTheDocument();
    expect(screen.getByText("2 boletos atrasados")).toBeInTheDocument();
    expect(screen.getByText("não pague boletos atrasados")).toBeInTheDocument();
    expect(
      screen.getByText("considere evitar novos atrasos"),
    ).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("score-details-close-button"));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
