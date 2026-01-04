import type { QueryClient } from "@tanstack/react-query";
import { queryOptions, mutationOptions } from "@tanstack/react-query";
import { deleteData, getData, patchData, postData } from "../services/api";
import type {
  BillFilterStatus,
  IBill,
  ICreateBillBody,
} from "../types/bills.type";

export type BillsResponse = {
  bills: IBill[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type CreateBillResponse = {
  bill: IBill;
};

export const billsQueries = {
  getAll: (page: number, status?: BillFilterStatus, category?: string) =>
    queryOptions({
      queryKey: ["bills", { page, status: status ?? null }],
      queryFn: () => {
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        if (status) qs.set("status", status);
        if (category) qs.set("category", category);

        return getData<BillsResponse>(`/bills?${qs.toString()}`);
      },
      retry: false,
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
      },
    }),
};
