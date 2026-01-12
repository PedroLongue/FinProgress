export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
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
  monthsCount: number
): string[] => {
  // Ex: mesesCount=3 => [YYYY-MM (2 atrás), YYYY-MM (1 atrás), YYYY-MM (atual)]
  const keys: string[] = [];
  for (let i = monthsCount - 1; i >= 0; i--) {
    keys.push(formatMonthKey(addMonths(start, -i)));
  }
  return keys;
};
