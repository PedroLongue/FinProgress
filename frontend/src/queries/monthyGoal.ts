import type { QueryClient } from "@tanstack/react-query";
import { mutationOptions } from "@tanstack/react-query";
import { getData, postData } from "../services/api";
import type {
  ICreateOrUpdateGoalBody,
  ICreateOrUpdateGoalResponse,
  IMonthlyGoalData,
} from "../types/goal.type";

export const goalQueries = {
  getMonthyGoal: () => ({
    queryKey: ["monthly-goal"],
    queryFn: () => {
      return getData<IMonthlyGoalData>("/monthly-goal");
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
