import type { QueryClient } from "@tanstack/react-query";
import { mutationOptions } from "@tanstack/react-query";
import { getData, postData } from "../services/api";
import type {
  ICreateOrUpdateGoalBody,
  ICreateOrUpdateGoalResponse,
  IMonthlyGoalData,
  IMonthlyGoalHistory,
} from "../types/goal.type";

export const goalQueries = {
  getMonthyGoal: () => ({
    queryKey: ["monthly-goal"],
    queryFn: () => {
      return getData<IMonthlyGoalData>("/monthly-goal");
    },
  }),

  getGoalHistory: (range?: number) => ({
    queryKey: ["monthly-goal-history", { range: range ?? null }],
    queryFn: () => {
      return getData<IMonthlyGoalHistory[]>(
        `/monthly-goal/history?range=${range}`,
      );
    },
  }),
};

export const goalMutation = {
  createOrUpdateGoal: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: ["create-or-update-goal"],
      mutationFn: async (body: { amount: number }) => {
        return await postData<
          ICreateOrUpdateGoalResponse,
          ICreateOrUpdateGoalBody
        >("/monthly-goal", body);
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["monthly-goal"] });
      },
    }),
};
