import { render, screen, fireEvent } from "@testing-library/react";
import Header from ".";
import type { NotificationsResponse } from "../../../types/notifications.type";
import { notificationsMock } from "../../../mocks/notifications.mock";

const refetchNotificationsMock = vi.fn();
const mutateAsyncMock = vi.fn().mockResolvedValue(undefined);

let notificationsCountMock: { unread: number } = { unread: 0 };
let pushNotificationsMock: NotificationsResponse[] = [];
const isFetchingListMock = false;

vi.mock("@/hooks/useNotifications", () => ({
  useNotificationsList: () => ({
    pushNotifications: pushNotificationsMock,
    isLoading: isFetchingListMock,
    refetchNotifications: refetchNotificationsMock,
  }),
  useNotificationsCount: () => ({
    notificationsCount: notificationsCountMock,
  }),
  useNotificationsActions: () => ({
    markNotificationRead: { mutateAsync: mutateAsyncMock },
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { notificationsEnabled: true },
  }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    notificationsCountMock = { unread: 0 };
    pushNotificationsMock = [];
  });

  it("should render without crashing", () => {
    render(<Header />);

    expect(screen.getByTestId("notifications-button")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu-button")).toBeInTheDocument();
  });

  it("should open user menu when button is clicked", () => {
    render(<Header />);

    const userButton = screen.getByTestId("user-menu-button");
    fireEvent.click(userButton);

    expect(screen.getByText("Sua conta")).toBeInTheDocument();
    expect(screen.getByText("Gerencie seu perfil")).toBeInTheDocument();
    expect(screen.getByText("Editar informações")).toBeInTheDocument();
  });

  it("should open notifications menu when button is clicked", () => {
    render(<Header />);

    const notificationsButton = screen.getByTestId("notifications-button");
    fireEvent.click(notificationsButton);

    expect(screen.getByText("Notificações")).toBeInTheDocument();
    expect(
      screen.getByText("Nenhuma notificação não lida"),
    ).toBeInTheDocument();
  });

  it("should display notification count badge when there are unread notifications", () => {
    notificationsCountMock = { unread: 3 };
    render(<Header />);

    const badge = screen.getByText("3");
    expect(badge).toBeInTheDocument();
  });

  it("should display '99+' when there are more than 99 unread notifications", () => {
    notificationsCountMock = { unread: 100 };
    render(<Header />);

    const badge = screen.getByText("99+");
    expect(badge).toBeInTheDocument();
  });

  it("should filter out read notifications from the list", () => {
    pushNotificationsMock = notificationsMock;
    notificationsCountMock = { unread: 2 };
    render(<Header />);

    const notificationsButton = screen.getByTestId("notifications-button");
    fireEvent.click(notificationsButton);

    expect(screen.getByText("2 não lidas")).toBeInTheDocument();
    expect(screen.queryByText("Notificação lida")).not.toBeInTheDocument();
  });
});
