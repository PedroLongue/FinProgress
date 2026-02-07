import { AlertCircle, AlertTriangle, Check, Clock } from "lucide-react";

export const STATUS_CONFIG = {
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
