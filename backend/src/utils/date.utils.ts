export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
};

export const startOfDay = (date: Date): Date => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
};

export const addDays = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
};

export const nextMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0, 0);
};

export const addMonths = (date: Date, months: number): Date => {
  return new Date(date.getFullYear(), date.getMonth() + months, 1, 0, 0, 0, 0);
};

export const formatMonthKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

export const buildMonthBuckets = (
  start: Date,
  monthsCount: number,
): string[] => {
  // Ex: mesesCount=3 => [YYYY-MM (2 atrás), YYYY-MM (1 atrás), YYYY-MM (atual)]
  const keys: string[] = [];
  for (let i = monthsCount - 1; i >= 0; i--) {
    keys.push(formatMonthKey(addMonths(start, -i)));
  }
  return keys;
};

export const parseMonthYYYYMM = (monthStr: string) => {
  const match = /^(\d{4})-(\d{2})$/.exec(monthStr);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;

  return new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
};

export const parseISODate = (value: unknown): Date | null => {
  if (typeof value !== "string" || !value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatYMDToBR = (ymd: string): string => {
  if (typeof ymd !== "string") return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return "";
  const [, y, mm, dd] = m;
  return `${dd}/${mm}/${y}`;
};
