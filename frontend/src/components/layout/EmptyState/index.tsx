import {
  BarChart3,
  TrendingUp,
  SearchAlertIcon,
  FileText,
  Sparkles,
  PieChart,
  Tag,
} from "lucide-react";

interface IEmptyState {
  type: "spending" | "billList" | "category";
  emptyBillListFilter?: string[];
}

export const EmptyState = ({ type, emptyBillListFilter }: IEmptyState) => {
  const configs = {
    spending: {
      icon: BarChart3,
      title: "Nenhum gasto registrado",
      description:
        "Cadastre seus boletos para visualizar o histórico de gastos mensais e comparativos.",
    },
    billList: {
      icon: emptyBillListFilter ? SearchAlertIcon : FileText,
      title: emptyBillListFilter
        ? "Nenhum boleto cadastrado no filtro"
        : "Nenhum boleto cadastrado",
      description: emptyBillListFilter
        ? "Não encontramos boletos com os filtros aplicados. Tente alterar a categoria ou status."
        : "Comece adicionando seus boletos para acompanhar vencimentos enunca mais perca prazos.",
    },
    category: {
      icon: PieChart,
      title: "Nenhuma categoria com gastos",
      description:
        "Não há gastos registrados nas categorias selecionadas. Tente alterar o período ou cadastre boletos.",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/5 animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10" />
        </div>

        <div className="relative w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Icon className="w-7 h-7 text-primary-foreground" />
        </div>

        {type === "spending" && (
          <>
            <div className="absolute -top-2 -right-3 w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center animate-bounce-slow">
              <TrendingUp className="w-3 h-3 text-success" />
            </div>
            <div className="absolute -bottom-1 -left-2 w-5 h-5 rounded-full bg-warning/20" />
          </>
        )}

        {type === "billList" && (
          <>
            <div className="absolute -top-2 -right-3 w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center animate-bounce-slow">
              <Sparkles className="w-3 h-3 text-success" />
            </div>
            <div className="absolute -bottom-1 -left-2 w-5 h-5 rounded-full bg-warning/20" />
          </>
        )}

        {type === "category" && (
          <>
            <div className="absolute -top-2 -right-3 w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center animate-bounce-slow">
              <Tag className="w-3 h-3 text-accent" />
            </div>
            <div className="absolute -bottom-1 -left-2 w-5 h-5 rounded-full bg-warning/20" />
          </>
        )}
      </div>

      <h3
        className="text-lg font-semibold text-foreground mb-2"
        data-testid="empty-state-title"
      >
        {config.title}
      </h3>
      <p
        className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed"
        data-testid="empty-state-description"
      >
        {config.description}
      </p>

      {type === "spending" && (
        <div className="flex items-end justify-center gap-2 mb-6 h-20">
          {[40, 65, 35, 80, 55].map((height, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-6 rounded-t-md bg-muted/50 transition-all"
                style={{ height: `${height}%` }}
              />
              <div className="w-1.5 h-1.5 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      )}

      {type === "billList" && (
        <div className="w-full max-w-sm space-y-2 mb-6">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/20"
              style={{ opacity: 1 - i * 0.25 }}
            >
              <div className="w-10 h-10 rounded-lg bg-muted/40" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 rounded bg-muted/50" />
                <div className="h-2 w-16 rounded bg-muted/30" />
              </div>
              <div className="h-4 w-16 rounded bg-muted/40" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
