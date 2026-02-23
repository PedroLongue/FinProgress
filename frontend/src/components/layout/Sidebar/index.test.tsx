import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from ".";
import { useIsMobile } from "../../../hooks/useMobile";

const onLogoutMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...props }: { children: React.ReactNode; to: string }) => (
    <a href={props.to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuthActions: () => ({
    logout: { mutate: onLogoutMock, isPending: false },
  }),
}));

vi.mock("@/hooks/useOnClickOutside", () => ({
  useOnClickOutside: vi.fn(),
}));

describe("Sidebar Component", () => {
  it("should render without crashing", () => {
    render(<Sidebar />);
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("should render brand title", () => {
    render(<Sidebar />);
    expect(screen.getByText("FinProgress")).toBeInTheDocument();
  });

  it("should render all menu options texts", () => {
    render(<Sidebar />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Boletos")).toBeInTheDocument();
    expect(screen.getByText("Análise de gastos")).toBeInTheDocument();
    expect(screen.getByText("Notificações")).toBeInTheDocument();
  });

  it("should render logout button", () => {
    render(<Sidebar />);
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
  });

  it("should render mobile toggle button (even on desktop it exists in DOM)", () => {
    render(<Sidebar />);

    expect(
      screen.getByRole("button", { name: "Abrir menu" }),
    ).toBeInTheDocument();
  });

  it("should toggle menu on mobile and lock body scroll", async () => {
    vi.clearAllMocks();
    vi.mocked(useIsMobile).mockReturnValue(true);

    render(<Sidebar />);

    const user = userEvent.setup();
    const openBtn = screen.getByRole("button", { name: "Abrir menu" });
    expect(openBtn).toHaveAttribute("aria-expanded", "false");

    await user.click(openBtn);

    const closeBtn = screen.getByRole("button", { name: "Fechar menu" });
    expect(closeBtn).toHaveAttribute("aria-expanded", "true");
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(closeBtn);

    expect(screen.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("should call logout on logout button click", async () => {
    vi.clearAllMocks();

    const user = userEvent.setup();
    render(<Sidebar />);

    const logoutButton = screen.getByTestId("logout-button");
    await user.click(logoutButton);

    expect(onLogoutMock).toHaveBeenCalledTimes(1);
  });
});
