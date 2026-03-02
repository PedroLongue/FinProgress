export interface IBillScore {
  score: number;
  totalBills: number;
  totalPaidNotLate: number;
  totalPaidLate: number;
  totalLate: number;
}

export const billScoreCalculator = ({
  totalBills,
  totalPaidNotLate,
  totalPaidLate,
  totalLate,
}: IBillScore) => {
  const raw = totalPaidNotLate * 1.0 + totalPaidLate * -0.5 + totalLate * -2.0;

  const maxScore = totalBills * 1.0;
  const minScore = totalBills * -2.0;

  const normalized = (raw - minScore) / (maxScore - minScore);

  return Math.round(Math.max(0, Math.min(1, normalized)) * 100);
};
