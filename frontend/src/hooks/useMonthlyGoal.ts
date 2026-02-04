import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { goalMutation, goalQueries } from "../queries/monthyGoal";

export const useMonthlyGoal = () => {
  const {
    data: monthlyGoal,
    isLoading,
    isError,
  } = useQuery(goalQueries.getMonthyGoal());

  return { monthlyGoal, isLoading, isError };
};

export const useMonthlyGoalHistory = (range?: number) => {
  const {
    data: goalHistory,
    isLoading,
    isError,
  } = useQuery(goalQueries.getGoalHistory(range));

  return { goalHistory, isLoading, isError };
};

export const useMonthlyGoalActions = () => {
  const queryClient = useQueryClient();

  const baseCreateOrUpdateGoal = goalMutation.createOrUpdateGoal(queryClient);
  const createOrUpdateGoal = useMutation({
    ...baseCreateOrUpdateGoal,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseCreateOrUpdateGoal.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context,
      );
    },
    onError: (error) => {
      console.error("Create bill error:", error);
    },
  });

  return { createOrUpdateGoal };
};
