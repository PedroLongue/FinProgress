export type BillStatusKey = "PENDING" | "PAID" | "PAID_LATE" | "OVERDUE" | "";
export type BillFilterStatus = BillStatusKey | "UNPAID";

export type Bill = {
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
};

export type CreateBillBody = {
  title: string;
  amount: number;
  dueDate: string;
  category?: string;
  barcode?: string;
  description?: string;
  status?: BillStatusKey;
  paidAt?: string | null;
};

export type ScoreExplanation = {
  title: string;
  summary: string;
  bills: string[];
  nextSteps: string[];
  confidence: number;
};
