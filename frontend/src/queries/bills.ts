import type { QueryClient } from "@tanstack/react-query";
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import {
  deleteData,
  getData,
  patchData,
  postData,
  postFormData,
} from "../services/api";
import type {
  BillFilterStatus,
  Bill,
  CreateBillBody,
  ScoreExplanation,
} from "../types/bills.type";

export type BillsResponse = {
  bills: Bill[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  userCategories: string[] | null;
};

export type CreateBillResponse = {
  bill: Bill;
};

export type BillDetailsResponse = {
  totalBills: number;
  totalPaidNotLate: number;
  totalPaidLate: number;
  totalPending: number;
  totalLate: number;
  score: number;
};

export type BillScoreExplanation = {
  scoreExplanation: ScoreExplanation;
};

export const billsQueries = {
  getAll: (
    page: number,
    status?: BillFilterStatus,
    category?: string,
    startDate?: string,
    endDate?: string,
  ) =>
    queryOptions({
      queryKey: [
        "bills",
        {
          page,
          status: status ?? null,
          category: category ?? null,
          startDate: startDate ?? null,
          endDate: endDate ?? null,
        },
      ],
      queryFn: () => {
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (status) qs.set("status", status);
        if (category) qs.set("category", category);
        if (startDate) qs.set("start", startDate);
        if (endDate) qs.set("end", endDate);

        return getData<BillsResponse>(`/bills?${qs.toString()}`);
      },
      retry: false,
    }),

  details: () =>
    queryOptions({
      queryKey: ["bill-details"],
      queryFn: () => {
        return getData<BillDetailsResponse>("/bills/bill-details");
      },
    }),

  explanation: () =>
    queryOptions({
      queryKey: ["bill-score-explanation"],
      queryFn: () => {
        return getData<BillScoreExplanation>("/bills/bill-score-explanation");
      },
      // só considera "stale" depois de 24h
      staleTime: 24 * 60 * 60 * 1000,

      // mantém no cache por 24h (ou mais) mesmo sem componente usando
      gcTime: 24 * 60 * 60 * 1000,

      // não refaz automaticamente quando montar o componente
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),
};

export const billsMutations = {
  create: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: ["createBill"],
      mutationFn: async (body: CreateBillBody) => {
        const res = await postData<CreateBillResponse, CreateBillBody>(
          "/bills",
          body,
        );
        return res.bill;
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["bills"] });
        qc.invalidateQueries({ queryKey: ["spending-report"] });
        qc.invalidateQueries({ queryKey: ["spending-report-by-category"] });
      },
    }),

  createByPdf: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: ["createBillByPdf"],
      mutationFn: async (file: File) => {
        const fd = new FormData();
        fd.append("file", file);

        const res = await postFormData<CreateBillResponse>(
          "/bills/from-pdf",
          fd,
        );

        return res.bill;
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["bills"] });
        qc.invalidateQueries({ queryKey: ["spending-report"] });
        qc.invalidateQueries({ queryKey: ["spending-report-by-category"] });
      },
    }),

  update: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: ["updateBill"],
      mutationFn: async ({
        id,
        body,
      }: {
        id: string;
        body: Partial<CreateBillBody>;
      }) => {
        const res = await patchData<{ bill: Bill }, Partial<CreateBillBody>>(
          `/bills/${id}`,
          body,
        );
        return res.bill;
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["bills"] });
        qc.invalidateQueries({ queryKey: ["spending-report"] });
        qc.invalidateQueries({ queryKey: ["spending-report-by-category"] });
      },
    }),

  delete: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: ["deleteBill"],
      mutationFn: async (id: string) => {
        await deleteData<void>(`/bills/${id}`);
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["bills"] });
        qc.invalidateQueries({ queryKey: ["spending-report"] });
        qc.invalidateQueries({ queryKey: ["spending-report-by-category"] });
      },
    }),
};
