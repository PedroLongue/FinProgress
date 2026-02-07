export interface IBillScore {
  score: number;
  totalBills: number;
  totalPaidNotLate: number;
  totalPaidLate: number;
  totalPending: number;
  totalLate: number;
}

export const billScoreCalculator = ({
  totalBills,
  totalPaidNotLate,
  totalPaidLate,
  totalPending,
  totalLate,
}: IBillScore) => {
  const denom = Math.max(totalBills, 1);

  const raw =
    totalPaidNotLate * 1.0 - // recompensa pagamento sem atraso
    totalPaidLate * 0.5 - // penaliza atraso, mas menos (porque foi pago)
    totalPending * 1.0 - // pendente reduz o score (ainda é risco)
    totalLate * 2.0; // vencido não pago pesa mais

  const maxScore = denom * 1.0;
  const minScore = denom * -2.0;
  const normalized = (raw - minScore) / (maxScore - minScore);
  return Math.round(Math.max(0, Math.min(1, normalized)) * 100);
};
