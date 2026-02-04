export interface ICreateOrUpdateGoalBody {
  amount: number;
}

export interface ICreateOrUpdateGoalResponse {
  month: string;
  goalAmount: number;
  goalUpdateAt: Date;
}

export interface IMonthlyGoalData extends ICreateOrUpdateGoalResponse {
  totalDue: number;
  billsCount: number;
  remainning: number;
  percentUsed: number;
}

export interface IMonthlyGoalHistory {
  month: string;
  goalAmount: number | null;
  spent: number;
}
