import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Profile } from ".";

const mutateAsyncMock = vi.hoisted(() => vi.fn());

vi.mock("@/hooks/useAuth", () => ({
  useAuthActions: () => ({
    changePassword: {
      mutateAsync: mutateAsyncMock,
      isPending: false,
    },
  }),
}));

describe("Profile Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("render the profile page without crashing", () => {
    render(<Profile />);
    expect(screen.getByTestId("profile-page")).toBeInTheDocument();
  });

  it("should call changePassword successfully", async () => {
    const user = userEvent.setup();
    render(<Profile />);

    await user.type(screen.getByTestId("current-password-input"), "123456");
    await user.type(screen.getByTestId("new-password-input"), "12345678");
    await user.type(
      screen.getByTestId("confirm-new-password-input"),
      "12345678",
    );

    await user.click(screen.getByTestId("save-changes-button"));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        currentPassword: "123456",
        newPassword: "12345678",
        confirmNewPassword: "12345678",
      });
    });
  });

  it("should show error when confirm password does not match", async () => {
    const user = userEvent.setup();
    render(<Profile />);

    await user.type(screen.getByTestId("current-password-input"), "123456");
    await user.type(screen.getByTestId("new-password-input"), "123456789");
    await user.type(
      screen.getByTestId("confirm-new-password-input"),
      "12345678",
    );

    await user.click(screen.getByTestId("save-changes-button"));

    await waitFor(() => {
      expect(
        screen.getByTestId("confirm-new-password-error"),
      ).toHaveTextContent("A nova senha e a confirmação devem ser iguais");
    });

    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("should show error when new password equals current password", async () => {
    const user = userEvent.setup();
    render(<Profile />);

    await user.type(screen.getByTestId("current-password-input"), "123456");
    await user.type(screen.getByTestId("new-password-input"), "123456");
    await user.type(screen.getByTestId("confirm-new-password-input"), "123456");

    await user.click(screen.getByTestId("save-changes-button"));

    await waitFor(() => {
      expect(screen.getByTestId("new-password-error")).toHaveTextContent(
        "A nova senha não pode ser igual à senha atual",
      );
    });

    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("should show min length errors for all fields", async () => {
    const user = userEvent.setup();
    render(<Profile />);

    // dispara validação (com defaultValues vazios)
    await user.click(screen.getByTestId("save-changes-button"));

    await waitFor(() => {
      expect(screen.getByTestId("current-password-error")).toHaveTextContent(
        "A senha atual deve ter no mínimo 5 caracteres",
      );
      expect(screen.getByTestId("new-password-error")).toHaveTextContent(
        "A nova senha deve ter no mínimo 5 caracteres",
      );
      expect(
        screen.getByTestId("confirm-new-password-error"),
      ).toHaveTextContent(
        "A confirmação da nova senha deve ter no mínimo 5 caracteres",
      );
    });

    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });
});
