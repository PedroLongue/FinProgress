import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Notifications } from ".";

const useAuthMock = vi.hoisted(() => vi.fn());
const mutateMock = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("@/hooks/useNotifications", () => ({
  useNotificationsActions: () => ({
    updateNotificationsSettings: {
      mutate: mutateMock,
      isLoading: false,
    },
  }),
}));

describe("Notifications Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAuthMock.mockReturnValue({
      user: {
        id: "123",
        emailNotificationsEnabled: true,
        notificationsEnabled: true,
        telegramNotificationsEnabled: true,
        billReminderDays: 2,
      },
      isLoading: false,
    });
  });

  it("should render the notifications page without crashing", () => {
    render(<Notifications />);
    expect(screen.getByTestId("notifications-page")).toBeInTheDocument();

    expect(screen.getByTestId("push-title")).toBeInTheDocument();
    expect(screen.getByTestId("email-title")).toBeInTheDocument();
  });

  it("should render loading state when auth is loading", () => {
    useAuthMock.mockReturnValueOnce({
      user: undefined,
      isLoading: true,
    });

    render(<Notifications />);

    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("should show days advance section when at least one channel is enabled", () => {
    render(<Notifications />);
    expect(screen.getByTestId("days-advance-section")).toBeInTheDocument();
    expect(screen.getByTestId("days-advance-description")).toHaveTextContent(
      "Me avise 2 dias antes do vencimento",
    );
  });

  it("should hide days advance section when both channels are disabled", async () => {
    const user = userEvent.setup();
    render(<Notifications />);

    await user.click(screen.getByTestId("push-switch"));
    await user.click(screen.getByTestId("email-switch"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("days-advance-section"),
      ).not.toBeInTheDocument();
    });
  });

  it("should update days advance description when slider value changes", async () => {
    render(<Notifications />);

    const slider = screen.getByTestId("days-advance-slider");
    slider.dispatchEvent(new CustomEvent("valueChange", { detail: [5] }));

    slider.dispatchEvent(new Event("input", { bubbles: true }));

    await waitFor(() => {
      expect(screen.getByTestId("days-advance-description")).toHaveTextContent(
        "Me avise 2 dias antes do vencimento",
      );
    });
  });

  it("should call updateNotificationsSettings mutate with current settings on save", async () => {
    const user = userEvent.setup();
    render(<Notifications />);

    await user.click(screen.getByTestId("email-switch"));

    await user.click(screen.getByTestId("save-notifications-button"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledTimes(1);
      expect(mutateMock).toHaveBeenCalledWith({
        emailNotificationsEnabled: false,
        notificationsEnabled: true,
        telegramNotificationsEnabled: true,
        billReminderDays: 2,
      });
    });
  });

  it("should call connectTelegram when button is clicked", async () => {
    const user = userEvent.setup();

    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<Notifications />);

    const connectTelegramButton = screen.getByTestId("connect-telegram-button");
    expect(connectTelegramButton).toBeInTheDocument();

    await user.click(connectTelegramButton);

    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledWith(
        "https://t.me/finprogress_notify_bot?start=123",
        "_blank",
      );
    });
  });
});
