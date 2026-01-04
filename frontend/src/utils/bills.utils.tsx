import { AlertCircle, Check, Clock } from "lucide-react";
import type { BillStatusKey } from "../types/bills.type";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffDays = Math.ceil(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";
  if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
  if (diffDays <= 7) return `Em ${diffDays} dias`;

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
};

export const getStatusIcon = (status: BillStatusKey) => {
  switch (status) {
    case "PAID":
      return <Check className="w-4 h-4" />;
    case "OVERDUE":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export const getStatusStyles = (status: BillStatusKey) => {
  switch (status) {
    case "PAID":
      return "bg-success/20 text-success border-success/30";
    case "OVERDUE":
      return "bg-destructive/20 text-destructive border-destructive/30";
    default:
      return "bg-primary/20 text-primary border-primary/30";
  }
};

export const getStatusBadge = (status: BillStatusKey) => {
  switch (status) {
    case "PAID":
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          {getStatusIcon("PAID")}
          Pago
        </div>
      );
    case "OVERDUE":
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          {getStatusIcon("OVERDUE")} <span>Vencido</span>
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          {getStatusIcon("PENDING")} <span>Pendente</span>
        </div>
      );
  }
};
