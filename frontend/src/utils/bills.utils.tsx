import { AlertCircle, Check, Clock } from "lucide-react";

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

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "PAID":
      return <Check className="w-4 h-4" />;
    case "OVERDUE":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export const getStatusStyles = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-success/20 text-success border-success/30";
    case "OVERDUE":
      return "bg-destructive/20 text-destructive border-destructive/30";
    default:
      return "bg-primary/20 text-primary border-primary/30";
  }
};
