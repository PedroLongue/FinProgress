import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import type { ChangePasswordBody } from "../../types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "./validator";
import { cn } from "../../lib/utils";
import { useAuthActions } from "../../hooks/useAuth";

const Profile = () => {
  const { changePassword } = useAuthActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordBody) => {
    changePassword.mutateAsync(data);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 pb-24 lg:pb-6">
      <h1 className="text-2xl font-bold">Meu perfil</h1>

      <Card variant="gradient" className="overflow-hidden w-full max-w-xl">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Alterar senha
          </h3>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="text"
              placeholder="Senha atual"
              {...register("currentPassword")}
              className={cn(
                "pl-11",
                errors.currentPassword &&
                  "border-red-500! focus-visible:ring-red-500",
              )}
            />
            {errors.currentPassword?.message && (
              <p className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}

            <Input
              type="text"
              placeholder="Nova senha"
              {...register("newPassword")}
              className={cn(
                "pl-11",
                errors.newPassword &&
                  "border-red-500! focus-visible:ring-red-500",
              )}
            />
            {errors.newPassword?.message && (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}

            <Input
              type="text"
              placeholder="Confirmar nova senha"
              {...register("confirmNewPassword")}
              className={cn(
                "pl-11",
                errors.confirmNewPassword &&
                  "border-red-500! focus-visible:ring-red-500",
              )}
            />
            {errors.confirmNewPassword?.message && (
              <p className="text-sm text-destructive">
                {errors.confirmNewPassword.message}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              variant="premium"
            >
              Salvar alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
