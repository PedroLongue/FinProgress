import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../lib/utils";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useAuthActions } from "../../hooks/useAuth";
import { loginSchema, registerSchema } from "./validator";

type AuthFormData = {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, sendResetPasswordEmail } = useAuthActions();

  const {
    register: loginRegister,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<AuthFormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: AuthFormData) => {
    if (isLogin) {
      await login.mutateAsync({ email: data.email, password: data.password });
    } else {
      await register.mutateAsync({
        name: data.name ?? "",
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword ?? "",
      });
    }
  };

  const features = [
    {
      icon: Zap,
      title: "IA Inteligente",
      description: "Escaneamento automático de boletos",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Seus dados protegidos com criptografia de ponta",
    },
    {
      icon: TrendingUp,
      title: "Insights Financeiros",
      description: "Análise detalhada dos seus gastos e tendências",
    },
  ];

  return (
    <div className="min-h-screen flex" data-testid="auth-page">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold text-foreground">
                FinProgress
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-6 leading-tight">
              Gerencie seus boletos com{" "}
              <span className="text-gradient-primary">
                inteligência artificial
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-12 max-w-md">
              Nunca mais perca uma data de vencimento. O FinProgress organiza,
              analisa e te alerta automaticamente.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <Card variant="glass" className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center pb-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                FinProgress
              </span>
            </div>
            <CardTitle data-testid="auth-title" className="text-2xl">
              {isLogin ? "Bem-vindo de volta" : "Criar conta"}
            </CardTitle>
            <CardDescription data-testid="auth-description">
              {isLogin
                ? "Entre na sua conta para continuar"
                : "Comece a gerenciar seus boletos hoje"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form
              data-testid="auth-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      data-testid="auth-name-input"
                      {...loginRegister("name")}
                      type="text"
                      placeholder="Seu nome"
                      className={cn(
                        "pl-11",
                        errors.name &&
                          "border-red-500! focus-visible:ring-red-500",
                      )}
                    />
                  </div>
                  {errors.name?.message && (
                    <p
                      data-testid="auth-name-error"
                      className="text-sm text-destructive"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="auth-email-input"
                  {...loginRegister("email")}
                  type="email"
                  placeholder="seu@email.com"
                  className={cn(
                    "pl-11",
                    errors.email &&
                      "border-red-500! focus-visible:ring-red-500",
                  )}
                />
              </div>
              {errors.email?.message && (
                <p
                  data-testid="auth-email-error"
                  className="text-sm text-destructive"
                >
                  {errors.email.message}
                </p>
              )}

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="auth-password-input"
                  {...loginRegister("password")}
                  type="password"
                  placeholder="Senha"
                  className={cn(
                    "pl-11",
                    errors.password &&
                      "border-red-500! focus-visible:ring-red-500",
                  )}
                />
              </div>
              {errors.password?.message && (
                <p
                  data-testid="auth-password-error"
                  className="text-sm text-destructive"
                >
                  {errors.password.message}
                </p>
              )}

              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      data-testid="auth-confirm-password-input"
                      {...loginRegister("confirmPassword")}
                      type="password"
                      placeholder="Confirmar senha"
                      className={cn(
                        "pl-11",
                        errors.confirmPassword &&
                          "border-red-500! focus-visible:ring-red-500",
                      )}
                    />
                  </div>
                  {errors.confirmPassword?.message && (
                    <p
                      data-testid="auth-confirm-password-error"
                      className="text-sm text-destructive"
                    >
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </>
              )}

              {isLogin && (
                <div className="text-right">
                  <button
                    data-testid="auth-forgot-password"
                    type="button"
                    onClick={async () => {
                      const isValid = await trigger("email");

                      if (!isValid) return;

                      const emailValue = getValues("email");

                      sendResetPasswordEmail.mutate(emailValue);
                    }}
                    className="text-sm text-primary hover:underline cursor-pointer"
                    disabled={sendResetPasswordEmail.isPending}
                  >
                    {sendResetPasswordEmail.isPending
                      ? "Enviando..."
                      : "Esqueceu a senha?"}
                  </button>
                </div>
              )}

              <Button
                data-testid="auth-submit"
                type="submit"
                variant="premium"
                size="lg"
                className="w-full"
              >
                {isLogin ? "Entrar" : "Criar conta"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
              <button
                data-testid="auth-toggle-mode"
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover:underline cursor-pointer"
              >
                {isLogin ? "Criar conta" : "Entrar"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
