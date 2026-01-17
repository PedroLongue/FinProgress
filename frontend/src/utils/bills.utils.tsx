import { AlertCircle, Check, Clock, AlertTriangle } from "lucide-react";
import type { BillStatusKey } from "../types/bills.type";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffDays = Math.ceil(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";
  if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
  if (diffDays <= 7) return `Em ${diffDays} dias`;

  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

const STATUS_CONFIG = {
  PENDING: {
    icon: Clock,
    label: "Pendente",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-800",
  },
  PAID: {
    icon: Check,
    label: "Pago",
    color: "text-green-500",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    textColor: "text-green-800",
  },
  PAID_LATE: {
    icon: AlertTriangle,
    label: "Pago com atraso",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-800",
  },
  OVERDUE: {
    icon: AlertCircle,
    label: "Vencido",
    color: "text-red-500",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    textColor: "text-red-800",
  },
  "": {
    icon: AlertCircle,
    label: "Vencido",
    color: "text-red-500",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    textColor: "text-red-800",
  },
} as const;

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

export const getStatusLabel = (status: BillStatusKey) =>
  STATUS_CONFIG[status].label;

export const getStatusColor = (status: BillStatusKey) =>
  STATUS_CONFIG[status].color;

export const isPaid = (status: BillStatusKey) =>
  status === "PAID" || status === "PAID_LATE";

export const isOverdue = (status: BillStatusKey) => status === "OVERDUE";

export const isPending = (status: BillStatusKey) => status === "PENDING";

export const dateToText = (date: string) => {
  const [year, month] = date.split("-");

  const months: Record<string, string> = {
    "01": "janeiro",
    "02": "fevereiro",
    "03": "março",
    "04": "abril",
    "05": "maio",
    "06": "junho",
    "07": "julho",
    "08": "agosto",
    "09": "setembro",
    "10": "outubro",
    "11": "novembro",
    "12": "dezembro",
  };

  const monthText = months[month] ?? "";

  if (!year || !monthText) return "";

  return `${monthText} de ${year}`;
};
