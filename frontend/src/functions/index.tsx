import { STATUS_CONFIG } from "../constants";
import type { BillStatusKey } from "../types/bills.type";

export const getStatusLabel = (status: BillStatusKey) =>
  STATUS_CONFIG[status].label;

export const getStatusColor = (status: BillStatusKey) =>
  STATUS_CONFIG[status].color;

export const isPaid = (status: BillStatusKey) =>
  status === "PAID" || status === "PAID_LATE";

export const isOverdue = (status: BillStatusKey) => status === "OVERDUE";

export const isPending = (status: BillStatusKey) => status === "PENDING";

export const getStatusIcon = (status: BillStatusKey) => {
  const Icon = STATUS_CONFIG[status].icon;
  return <Icon data-testid={`status-icon-${status}`} className="w-4 h-4" />;
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
