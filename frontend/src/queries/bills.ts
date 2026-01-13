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
  IBill,
  ICreateBillBody,
  IScoreExplanation,
} from "../types/bills.type";

export type BillsResponse = {
  bills: IBill[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  userCategories: string[] | null;
};

export type CreateBillResponse = {
  bill: IBill;
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
  scoreExplanation: IScoreExplanation;
};

export const billsQueries = {
  getAll: (page: number, status?: BillFilterStatus, category?: string) =>
    queryOptions({
      queryKey: [
        "bills",
        { page, status: status ?? null, category: category ?? null },
      ],
      queryFn: () => {
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (status) qs.set("status", status);
        if (category) qs.set("category", category);

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
      mutationFn: async (body: ICreateBillBody) => {
        const res = await postData<CreateBillResponse, ICreateBillBody>(
          "/bills",
          body
        );
        return res.bill;
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["bills"] });
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
          fd
        );

        return res.bill;
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["bills"] });
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
        body: Partial<ICreateBillBody>;
      }) => {
        const res = await patchData<{ bill: IBill }, Partial<ICreateBillBody>>(
          `/bills/${id}`,
          body
        );
        return res.bill;
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["bills"] });
        qc.invalidateQueries({ queryKey: ["spending-report"] });
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
      },
    }),
};
