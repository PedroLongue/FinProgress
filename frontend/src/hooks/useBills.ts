import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billsMutations, billsQueries } from "../queries/bills";
import type { BillFilterStatus } from "../types/bills.type";
import { useSnackbarStore } from "../stores/snackbar.store";
import type { AxiosError } from "axios";

type BillErrorResponse = {
  errors: string[];
};

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
  const showSnackbar = useSnackbarStore((s) => s.show);
  const queryClient = useQueryClient();

  const baseCreateBill = billsMutations.create(queryClient);
  const createNewBillMutation = useMutation({
    ...baseCreateBill,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseCreateBill.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error: AxiosError<BillErrorResponse>) => {
      showSnackbar({
        severity: "error",
        message: error.response?.data.errors[0] ?? "Erro ao criar boleto.",
      });
      console.error("Create bill error:", error.response?.data.errors[0]);
    },
  });

  const baseCreateBillByPdf = billsMutations.createByPdf(queryClient);
  const createNewBillByPdfMutation = useMutation({
    ...baseCreateBillByPdf,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseCreateBillByPdf.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error: AxiosError<BillErrorResponse>) => {
      showSnackbar({
        severity: "error",
        message: error.response?.data.errors[0] ?? "Erro ao criar boleto.",
      });
      console.error("Create bill error:", error.response?.data.errors[0]);
    },
  });

  const baseUpdateBill = billsMutations.update(queryClient);
  const updateBillMutation = useMutation({
    ...baseUpdateBill,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseUpdateBill.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error: AxiosError<BillErrorResponse>) => {
      showSnackbar({
        severity: "error",
        message: error.response?.data.errors[0] ?? "Erro ao atualizar boleto.",
      });
      console.error("Update bill error:", error.response?.data.errors[0]);
    },
  });

  const baseDeleteBill = billsMutations.delete(queryClient);
  const deleteBillMutation = useMutation({
    ...baseDeleteBill,
    onSuccess: (data, variables, onMutateResult, context) => {
      baseDeleteBill.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error: AxiosError<BillErrorResponse>) => {
      showSnackbar({
        severity: "error",
        message: error.response?.data.errors[0] ?? "Erro ao deletar boleto.",
      });
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
