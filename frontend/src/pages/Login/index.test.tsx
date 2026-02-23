import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthPage from ".";

const loginMutateAsyncMock = vi.fn().mockResolvedValue(undefined);
const registerMutateAsyncMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/hooks/useAuth", () => ({
  useAuthActions: () => ({
    login: { mutateAsync: loginMutateAsyncMock },
    register: { mutateAsync: registerMutateAsyncMock },
  }),
}));

describe("AuthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<AuthPage />);
  });

  it("should render login mode without crashing", () => {
    expect(screen.getByTestId("auth-form")).toBeInTheDocument();
    expect(screen.getByTestId("auth-title")).toHaveTextContent(/bem-vindo/i);

    expect(screen.getByTestId("auth-email-input")).toBeInTheDocument();
    expect(screen.getByTestId("auth-password-input")).toBeInTheDocument();

    expect(screen.queryByTestId("auth-name-input")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("auth-confirm-password-input"),
    ).not.toBeInTheDocument();
  });

  it("should show error messages when submitting empty login form and not call mutateAsync", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId("auth-submit"));

    expect(await screen.findByTestId("auth-email-error")).toBeInTheDocument();
    expect(screen.getByTestId("auth-email-error").textContent).toMatch(/.+/);

    expect(
      await screen.findByTestId("auth-password-error"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("auth-password-error").textContent).toMatch(/.+/);

    expect(loginMutateAsyncMock).not.toHaveBeenCalled();
    expect(registerMutateAsyncMock).not.toHaveBeenCalled();
  });

  it("should login when valid data is provided", async () => {
    const user = userEvent.setup();

    await user.type(screen.getByTestId("auth-email-input"), "test@test.com");
    await user.type(screen.getByTestId("auth-password-input"), "12345678");

    await user.click(screen.getByTestId("auth-submit"));

    await waitFor(() => {
      expect(loginMutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(loginMutateAsyncMock).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "12345678",
      });
    });

    expect(registerMutateAsyncMock).not.toHaveBeenCalled();
  });

  it("should toggle to register mode, show errors on empty submit, and register when valid", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId("auth-toggle-mode"));

    expect(screen.getByTestId("auth-title")).toHaveTextContent(/criar conta/i);
    expect(screen.getByTestId("auth-name-input")).toBeInTheDocument();
    expect(
      screen.getByTestId("auth-confirm-password-input"),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("auth-submit"));

    expect(await screen.findByTestId("auth-name-error")).toBeInTheDocument();
    expect(screen.getByTestId("auth-name-error").textContent).toMatch(/.+/);

    expect(await screen.findByTestId("auth-email-error")).toBeInTheDocument();
    expect(screen.getByTestId("auth-email-error").textContent).toMatch(/.+/);

    expect(
      await screen.findByTestId("auth-password-error"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("auth-password-error").textContent).toMatch(/.+/);

    expect(
      await screen.findByTestId("auth-confirm-password-error"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("auth-confirm-password-error").textContent,
    ).toMatch(/.+/);

    expect(registerMutateAsyncMock).not.toHaveBeenCalled();

    await user.clear(screen.getByTestId("auth-name-input"));
    await user.clear(screen.getByTestId("auth-email-input"));
    await user.clear(screen.getByTestId("auth-password-input"));
    await user.clear(screen.getByTestId("auth-confirm-password-input"));

    await user.type(screen.getByTestId("auth-name-input"), "Pedro");
    await user.type(screen.getByTestId("auth-email-input"), "pedro@test.com");
    await user.type(screen.getByTestId("auth-password-input"), "12345678");
    await user.type(
      screen.getByTestId("auth-confirm-password-input"),
      "12345678",
    );

    await user.click(screen.getByTestId("auth-submit"));

    await waitFor(() => {
      expect(registerMutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(registerMutateAsyncMock).toHaveBeenCalledWith({
        name: "Pedro",
        email: "pedro@test.com",
        password: "12345678",
        confirmPassword: "12345678",
      });
    });

    expect(loginMutateAsyncMock).not.toHaveBeenCalled();
  });
});
