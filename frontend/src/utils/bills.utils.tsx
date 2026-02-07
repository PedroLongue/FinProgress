import type { BillStatusKey } from "../types/bills.type";
import { STATUS_CONFIG } from "../constants";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

export const getStatusIcon = (status: BillStatusKey) => {
  const Icon = STATUS_CONFIG[status].icon;
  return <Icon className="w-4 h-4" />;
};

export const getStatusStyles = (status: BillStatusKey) => {
  const config = STATUS_CONFIG[status];
  return `${config.bgColor} ${config.textColor} border ${config.borderColor}`;
};

export const getStatusBadge = (status: BillStatusKey) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  );
};
