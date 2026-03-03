import { render, screen } from "@testing-library/react";
import { ResetPassword } from ".";
import userEvent from "@testing-library/user-event";

const resetPasswordMutateAsyncMock = vi.fn().mockResolvedValue(undefined);
const token = "test-token";

vi.mock("@tanstack/react-router", () => ({
  useSearch: () => ({ token }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuthActions: () => ({
    resetPassword: { mutateAsync: resetPasswordMutateAsyncMock },
  }),
}));

describe("ResetPassword Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<ResetPassword />);
  });

  it("should render the reset password form without crashing", () => {
    expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();
    expect(screen.getByTestId("reset-new-password-input")).toBeInTheDocument();
  });

  it("should show validation errors when submitting empty form and not call mutateAsync", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByTestId("reset-password-button"));

    expect(
      await screen.findByTestId("reset-new-password-error"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("reset-new-password-error").textContent).toMatch(
      /.+/,
    );
    expect(resetPasswordMutateAsyncMock).not.toHaveBeenCalled();
  });

  it("should call resetPassword with correct data when form is valid", async () => {
    const user = userEvent.setup();

    await user.type(screen.getByTestId("reset-new-password-input"), "12345678");
    await user.type(
      screen.getByTestId("reset-confirm-password-input"),
      "12345678",
    );
    await user.click(screen.getByTestId("reset-password-button"));

    expect(resetPasswordMutateAsyncMock).toHaveBeenCalledTimes(1);
    expect(resetPasswordMutateAsyncMock).toHaveBeenCalledWith({
      token,
      newPassword: "12345678",
      confirmNewPassword: "12345678",
    });
  });
});
