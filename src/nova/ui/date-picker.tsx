import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "../utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", disabled, className }: DatePickerProps) {
  const [uncontrolled, setUncontrolled] = useState<Date | undefined>();
  const isControlled = value !== undefined || onChange !== undefined;
  const current = isControlled ? value : uncontrolled;
  const handle = (d: Date | undefined) => {
    if (!isControlled) setUncontrolled(d);
    onChange?.(d);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled}
          className={cn("w-[240px] justify-start gap-2 text-left font-normal", !current && "text-muted-foreground", className)}>
          <CalendarIcon />
          {current ? formatDate(current) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={current} onSelect={handle} autoFocus />
      </PopoverContent>
    </Popover>
  );
}
