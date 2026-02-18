import { Trash2 } from "lucide-react";
import type { Bill } from "../../../types/bills.type";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import { Badge } from "../../ui/badge";
import { formatCurrency } from "../../../utils/bills.utils";
import { getStatusIcon, getStatusStyles } from "../../../functions";
import { formatDate } from "../../../utils/date.utils";
import { isOverdue, isPaid } from "../../../functions";
import { useIsMobile } from "../../../hooks/useMobile";

export const BillRow = ({
  bill,
  index,
  onEdit,
  onDelete,
}: {
  bill: Bill;
  index: number;
  onEdit: (bill: Bill) => void;
  onDelete: (bill: Bill) => void;
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      onClick={() => onEdit(bill)}
      className={cn(
        "group rounded-xl bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-all duration-200 animate-slide-up",
        isMobile ? "p-4 flex flex-col gap-3" : "p-4 flex items-center gap-4",
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
      data-testid="bill-row"
    >
      <div
        className={cn(
          isMobile
            ? "flex items-start gap-3"
            : "flex items-center gap-4 flex-1 min-w-0",
        )}
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
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-foreground truncate">
              {bill.title}
            </h4>

            {isMobile && (
              <span
                className={cn(
                  "font-semibold shrink-0",
                  isPaid(bill.status)
                    ? "text-success"
                    : isOverdue(bill.status)
                      ? "text-destructive"
                      : "text-foreground",
                )}
              >
                {formatCurrency(bill.amount)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
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

          {isMobile && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {bill.description || "Sem descrição"}
            </p>
          )}
        </div>

        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 transition-opacity shrink-0 -mt-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(bill);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {!isMobile && (
        <div className="flex-1 text-center px-4 min-w-0">
          <span className="text-left text-sm text-muted-foreground line-clamp-1">
            {bill.description || "Sem descrição"}
          </span>
        </div>
      )}

      {!isMobile && (
        <>
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
            data-testid={`delete-bill-button-${bill.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
};
