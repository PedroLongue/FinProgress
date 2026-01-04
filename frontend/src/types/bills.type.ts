export type BillStatusKey = "PENDING" | "PAID" | "PAID_LATE" | "OVERDUE";
export type BillFilterStatus = BillStatusKey | "UNPAID";

export interface IBill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  category?: string | null;
  status: BillStatusKey;
  createdAt?: string;
  barcode?: string | null;
  description?: string | null;
  paidAt?: string | null;
  userId: string;
}

export interface ICreateBillBody {
  title: string;
  amount: number;
  dueDate: string;
  category?: string;
  barcode?: string;
  description?: string;
  status?: BillStatusKey;
  paidAt?: string | null;
}
