const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const parseDateOnly = (iso: string) => {
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
