import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billsMutations, billsQueries } from "../queries/bills";
import type { BillFilterStatus } from "../types/bills.type";

export const useBill = (
  page = 1,
  status?: BillFilterStatus,
  category?: string,
  startDate?: string,
  endDate?: string,
) => {
  const {
    data: bills,
    isLoading,
    isError,
  } = useQuery(billsQueries.getAll(page, status, category, startDate, endDate));

  return {
    bills,
    isLoading,
    isError,
  };
};

export const useBillDetails = () => {
  const {
    data: billDetails,
    isLoading,
    isError,
  } = useQuery(billsQueries.details());

  return { billDetails, isLoading, isError };
};

export const useBillExplanation = () => {
  const {
    data: scoreExplanation,
    isLoading,
    isError,
  } = useQuery(billsQueries.explanation());

  return { scoreExplanation, isLoading, isError };
};

export const useBillsActions = () => {
  const queryClient = useQueryClient();

  const baseCreateBill = billsMutations.create(queryClient);
  const createNewBillMutation = useMutation({
    ...baseCreateBill,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseCreateBill.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error) => {
      console.error("Create bill error:", error);
    },
  });

  const baseCreateBillByPdf = billsMutations.createByPdf(queryClient);
  const createNewBillByPdfMutation = useMutation({
    ...baseCreateBillByPdf,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseCreateBillByPdf.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error) => {
      console.error("Create bill error:", error);
    },
  });

  const baseUpdateBill = billsMutations.update(queryClient);
  const updateBillMutation = useMutation({
    ...baseUpdateBill,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseUpdateBill.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error) => {
      console.error("Update bill error:", error);
    },
  });

  const baseDeleteBill = billsMutations.delete(queryClient);
  const deleteBillMutation = useMutation({
    ...baseDeleteBill,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseDeleteBill.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error) => {
      console.error("Delete bill error:", error);
    },
  });

  return {
    createBill: createNewBillMutation,
    createBillByPdf: createNewBillByPdfMutation,
    updateBill: updateBillMutation,
    deleteBill: deleteBillMutation,
  };
};
