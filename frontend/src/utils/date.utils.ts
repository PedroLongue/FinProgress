import { mapMonths } from "../constants";

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const parseDateOnly = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

export const formatDate = (dateString: string) => {
  const date = startOfDay(parseDateOnly(dateString));
  const today = startOfDay(new Date());

  const diffDays = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";
  if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
  if (diffDays <= 7) return `Em ${diffDays} dias`;

  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

export const dateToText = (date: string) => {
  const [year, month] = date.split("-");

  const monthText = mapMonths[month] ?? "";

  if (!year || !monthText) return "";

  return `${monthText} de ${year}`;
};

export const isoToDateInput = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const dateInputToISO = (date: string) => {
  if (!date) return "";

  return date;
};

export const formatMonthLabel = (ym: string) => {
  const [y, m] = ym.split("-");
  if (!y || !m) return ym;
  return `${m.padStart(2, "0")}/${y}`;
};

export const formatDateOnlyBR = (value: string | Date): string => {
  const d = value instanceof Date ? value : parseDateOnly(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
