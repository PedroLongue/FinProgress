import type { ICreateBillBody } from "../../types/bills.type";

interface ICreateBill {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bill: ICreateBillBody) => void;
}

export const BillCreateModal = ({ isOpen, onClose, onAdd }: ICreateBill) => {
  return <div>BillCreateModal</div>;
};
