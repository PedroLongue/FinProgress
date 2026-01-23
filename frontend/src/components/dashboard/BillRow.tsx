import { Trash2 } from "lucide-react";
import type { IBill } from "../../types/bills.type";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import {
  formatCurrency,
  formatDate,
  getStatusIcon,
  getStatusStyles,
  isOverdue,
  isPaid,
} from "../../utils/bills.utils";

export const BillRow = ({
  bill,
  index,
  onEdit,
  onDelete,
}: {
  bill: IBill;
  index: number;
  onEdit: (bill: IBill) => void;
  onDelete: (bill: IBill) => void;
}) => {
  return (
    <div
      onClick={() => onEdit(bill)}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-all duration-200 animate-slide-up",
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center border shrink-0",
          getStatusStyles(bill.status),
        )}
      >
        {getStatusIcon(bill.status)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-foreground truncate">{bill.title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="category">{bill.category}</Badge>
          <span
            className={cn(
              "text-xs",
              isOverdue(bill.status)
                ? "text-destructive font-medium"
                : "text-muted-foreground",
            )}
          >
            {formatDate(bill.dueDate)}
          </span>
        </div>
      </div>

      <div className="flex-1 text-center px-4">
        <span className="text-left text-sm text-muted-foreground line-clamp-1">
          {bill.description || "Sem descrição"}
        </span>
      </div>

      <div className="text-right shrink-0">
        <span
          className={cn(
            "font-semibold",
            isPaid(bill.status)
              ? "text-success"
              : isOverdue(bill.status)
                ? "text-destructive"
                : "text-foreground",
          )}
        >
          {formatCurrency(bill.amount)}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 transition-opacity shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(bill);
        }}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
