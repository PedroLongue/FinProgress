export const calculateBillStatus = (
  dueDate: Date,
  paidAt?: Date | null
): "PENDING" | "PAID" | "PAID_LATE" | "OVERDUE" => {
  if (paidAt) {
    if (paidAt > dueDate) {
      return "PAID_LATE";
    } else {
      return "PAID";
    }
  }

  const now = new Date();
  if (now > dueDate) {
    return "OVERDUE";
  }

  return "PENDING";
};
