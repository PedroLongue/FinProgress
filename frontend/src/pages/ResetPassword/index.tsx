import { useForm } from "react-hook-form";
import { useSearch } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../lib/utils";
import { useAuthActions } from "../../hooks/useAuth";
import { resetPasswordSchema } from "./validator";

type ResetPasswordForm = {
  newPassword: string;
  confirmNewPassword: string;
};

export const ResetPassword = () => {
  const { token } = useSearch({ from: "/reset-password" }) as {
    token?: string;
  };

  const { resetPassword } = useAuthActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordForm) => {
    if (!token) return;

    resetPassword.mutateAsync({
      token,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 px-4">
      <Card variant="gradient" className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-xl font-bold text-center">Redefinir senha</h1>

          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            data-testid="reset-password-form"
          >
            <Input
              type="password"
              placeholder="Nova senha"
              {...register("newPassword")}
              className={cn(
                errors.newPassword &&
                  "border-red-500! focus-visible:ring-red-500",
              )}
              data-testid="reset-new-password-input"
            />
            {errors.newPassword?.message && (
              <p
                className="text-sm text-destructive"
                data-testid="reset-new-password-error"
              >
                {errors.newPassword.message}
              </p>
            )}

            <Input
              type="password"
              placeholder="Confirmar nova senha"
              {...register("confirmNewPassword")}
              className={cn(
                errors.confirmNewPassword &&
                  "border-red-500! focus-visible:ring-red-500",
              )}
              data-testid="reset-confirm-password-input"
            />
            {errors.confirmNewPassword?.message && (
              <p
                className="text-sm text-destructive"
                data-testid="reset-confirm-password-error"
              >
                {errors.confirmNewPassword.message}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              variant="premium"
              className="w-full"
              disabled={resetPassword.isPending || !token}
              data-testid="reset-password-button"
            >
              {resetPassword.isPending ? "Redefinindo..." : "Redefinir senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
