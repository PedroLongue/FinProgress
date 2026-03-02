import CardContent from "@mui/material/CardContent";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Bell, Check, Clock, Smartphone } from "lucide-react";
import { useState } from "react";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import { Slider } from "../../components/ui/slider";
import { useAuth } from "../../hooks/useAuth";
import { Loading } from "../../components/ui/loading";
import { useNotificationsActions } from "../../hooks/useNotifications";

export const Notifications = () => {
  const { user, isLoading } = useAuth();
  const { updateNotificationsSettings } = useNotificationsActions();

  const [emailEnabled, setEmailEnabled] = useState(
    user?.emailNotificationsEnabled,
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.notificationsEnabled,
  );
  const [daysAdvance, setDaysAdvance] = useState(user?.billReminderDays || 2);

  if (isLoading) return <Loading />;

  const notificationTypes = [
    {
      id: "push",
      icon: Smartphone,
      title: "Notificações",
      description:
        "Alertas exibidos diretamente no sistema, acessíveis pelo ícone na barra superior.",
      enabled: notificationsEnabled,
      onToggle: setNotificationsEnabled,
      color: "text-warning",
      bgColor: "bg-warning/20",
    },
    {
      id: "email",
      icon: Bell,
      title: "Alertas por E-mail",
      description: "Notificações detalhadas na sua caixa de entrada",
      enabled: emailEnabled,
      onToggle: setEmailEnabled,
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
  ];

  const handleNotifications = () => {
    updateNotificationsSettings.mutate({
      emailNotificationsEnabled: emailEnabled,
      notificationsEnabled: notificationsEnabled,
      billReminderDays: daysAdvance,
    });
  };

  return (
    <div
      className="lg:p-6 space-y-6 pb-24 lg:pb-6"
      data-testid="notifications-page"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
        <p className="text-muted-foreground">
          Configure como deseja receber alertas
        </p>
      </div>

      <Card variant="gradient">
        <CardHeader>
          <CardTitle>Canais de Notificação</CardTitle>
          <CardDescription>
            Escolha onde deseja receber seus alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notificationTypes.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/30"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${notification.bgColor}`}>
                  <notification.icon
                    className={`w-5 h-5 ${notification.color}`}
                  />
                </div>
                <div>
                  <p
                    className="font-medium text-foreground"
                    data-testid={`${notification.id}-title`}
                  >
                    {notification.title}
                  </p>
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid={`${notification.id}-description`}
                  >
                    {notification.description}
                  </p>
                </div>
              </div>
              <Switch
                data-testid={`${notification.id}-switch`}
                checked={notification.enabled}
                onCheckedChange={notification.onToggle}
              />
            </div>
          ))}

          {(emailEnabled || notificationsEnabled) && (
            <div
              className="w-full flex flex-col items-center justify-between p-4 rounded-xl bg-secondary/30"
              data-testid="days-advance-section"
            >
              <div className="w-full flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p
                    className="font-medium text-foreground"
                    data-testid="days-advance-title"
                  >
                    Dias de antecedência
                  </p>
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid="days-advance-description"
                  >
                    Me avise {daysAdvance} {daysAdvance === 1 ? "dia" : "dias"}{" "}
                    antes do vencimento
                  </p>
                </div>
              </div>
              <div className="w-full pt-2 mt-5">
                <Slider
                  value={[daysAdvance]}
                  onValueChange={([val]) => setDaysAdvance(val)}
                  min={1}
                  max={7}
                  step={1}
                  className="w-full"
                  data-testid="days-advance-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1 dia</span>
                  <span>7 dias</span>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleNotifications}
            variant="success"
            className="w-full"
            data-testid="save-notifications-button"
          >
            <Check className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
