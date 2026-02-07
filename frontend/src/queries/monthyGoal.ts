import { mutationOptions } from "@tanstack/react-query";
import { getData, postData } from "../services/api";
import type {
  CreateOrUpdateGoalBody,
  CreateOrUpdateGoalResponse,
  MonthlyGoalData,
  MonthlyGoalHistory,
} from "../types/goal.type";

export const goalQueries = {
  getMonthyGoal: () => ({
    queryKey: ["monthly-goal"],
    queryFn: () => {
      return getData<MonthlyGoalData>("/monthly-goal");
    },
  }),

  getGoalHistory: (range?: number) => ({
    queryKey: ["monthly-goal-history", { range: range ?? null }],
    queryFn: () => {
      return getData<MonthlyGoalHistory[]>(
        `/monthly-goal/history?range=${range}`,
      );
    },
  }),
};

export const goalMutation = {
  createOrUpdateGoal: () =>
    mutationOptions({
      mutationKey: ["create-or-update-goal"],
      mutationFn: async (body: { amount: number }) => {
        return await postData<
          CreateOrUpdateGoalResponse,
          CreateOrUpdateGoalBody
        >("/monthly-goal", body);
      },
      onSuccess: () => {},
    }),
};
