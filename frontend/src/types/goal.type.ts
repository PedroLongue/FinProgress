export type CreateOrUpdateGoalBody = {
  amount: number;
};

export type CreateOrUpdateGoalResponse = {
  month: string;
  goalAmount: number;
  goalUpdateAt: Date;
};

export type MonthlyGoalData = CreateOrUpdateGoalResponse & {
  totalDue: number;
  billsCount: number;
  remainning: number;
  percentUsed: number;
};

export type MonthlyGoalHistory = {
  month: string;
  goalAmount: number | null;
  spent: number;
};
