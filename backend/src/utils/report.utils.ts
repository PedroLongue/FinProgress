export type ReportRange = 3 | 6 | 12;

export const parseReportRange = (value: unknown): ReportRange => {
  const raw = String(value ?? "3").trim();
  if (raw === "3") return 3;
  if (raw === "6") return 6;
  if (raw === "12") return 12;
  return 3;
};
