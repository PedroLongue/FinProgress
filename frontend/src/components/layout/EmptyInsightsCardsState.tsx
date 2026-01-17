import {
  DollarSign,
  Target,
  TrendingUp,
  BarChart3,
  Settings,
} from "lucide-react";
import { Button } from "../../components/ui/button";

interface IEmptyState {
  type: "total" | "goal" | "volume";
  title?: string;
  description?: string;
  onConfigureGoal?: () => void;
}

export const EmptyInsightsCardsState = ({
  type,
  title,
  description,
  onConfigureGoal,
}: IEmptyState) => {
  const configs = {
    total: {
      icon: DollarSign,
      defaultTitle: "Nenhum gasto registrado",
      defaultDescription:
        "Cadastre seus boletos para visualizar o total gasto no mês e comparativos.",
      bgColor: "bg-primary/5",
      iconColor: "text-primary",
      iconBg: "bg-primary/20",
    },
    goal: {
      icon: Target,
      defaultTitle: "Meta de orçamento não definida",
      defaultDescription:
        "Configure uma meta mensal para acompanhar seus gastos e manter o controle financeiro.",
      bgColor: "bg-success/20",
      iconColor: "text-success",
      iconBg: "bg-success/20",
    },
    volume: {
      icon: TrendingUp,
      defaultTitle: "Sem histórico de gastos",
      defaultDescription:
        "Não há dados suficientes para mostrar o volume e pico de gastos.",
      bgColor: "bg-warning/5",
      iconColor: "text-warning",
      iconBg: "bg-warning/20",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center h-full">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl ${config.iconBg} `}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground mb-2">
            {title || config.defaultTitle}
          </p>
          <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
            {description || config.defaultDescription}
          </p>
        </div>
      </div>

      <div className="w-full max-w-xs mb-6">
        {type === "total" && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-8 rounded-lg bg-muted/30" />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                <div className="w-16 h-3 rounded bg-muted/20" />
              </div>
            </div>
          </div>
        )}

        {type === "goal" && (
          <div className="space-y-3">
            <div className="h-2 w-full rounded-full bg-muted/30">
              <div className="h-full w-1/3 rounded-full bg-muted/50" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>R$ 0</span>
              <span>Meta não definida</span>
            </div>
          </div>
        )}

        {type === "volume" && (
          <div className="flex items-end justify-center gap-1.5 h-16">
            {[25, 40, 60, 35, 45, 55].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-4 rounded-t-md bg-muted/50 transition-all"
                  style={{ height: `${height}%` }}
                />
                <div className="w-1 h-1 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        )}
      </div>

      {type === "goal" && onConfigureGoal && (
        <Button onClick={onConfigureGoal} className="gap-2" size="sm">
          <Settings className="w-4 h-4" />
          Configurar orçamento
        </Button>
      )}
    </div>
  );
};
