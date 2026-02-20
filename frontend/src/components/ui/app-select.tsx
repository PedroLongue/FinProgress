import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type Option = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type AppSelectProps = {
  value: string | number;
  onChange: (value: string | number) => void;

  placeholder?: string;
  options: Option[];

  className?: string;

  disabled?: boolean;
  ariaLabel?: string;

  dataTestId?: string;
};

const toSelectValue = (v: string | number): string => {
  return String(v);
};

export const AppSelect = ({
  value,
  onChange,
  placeholder,
  options,
  className,
  disabled,
  ariaLabel,
  dataTestId,
}: AppSelectProps) => {
  return (
    <div className={cn(className)}>
      <Select
        value={toSelectValue(value)}
        onValueChange={(v) => onChange(v)}
        disabled={disabled}
      >
        <SelectTrigger
          aria-label={ariaLabel}
          data-testid={dataTestId}
          className={cn(
            "h-9",
            "rounded-md",
            "border border-transparent",
            "bg-secondary/30",
            "text-sm text-foreground",
            "focus:ring-2 focus:ring-primary focus:ring-offset-0",
            "data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:ring-offset-0",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          className={cn(
            "min-w-(--radix-select-trigger-width)",
            "border border-border",
            "bg-card/95 backdrop-blur",
            "text-foreground shadow-xl",
            "rounded-md",
          )}
        >
          <SelectItem value="__all__" className="text-sm">
            {placeholder}
          </SelectItem>

          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={toSelectValue(opt.value)}
              disabled={opt.disabled}
              className="text-sm"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
