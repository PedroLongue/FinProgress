import { STATUS_CONFIG } from "../constants";
import type { BillStatusKey } from "../types/bills.type";

export const getStatusLabel = (status: BillStatusKey) =>
  STATUS_CONFIG[status].label;

export const getStatusColor = (status: BillStatusKey) =>
  STATUS_CONFIG[status].color;

export const isPaid = (status: BillStatusKey) =>
  status === "PAID" || status === "PAID_LATE";

export const isOverdue = (status: BillStatusKey) => status === "OVERDUE";

export const isPending = (status: BillStatusKey) => status === "PENDING";
