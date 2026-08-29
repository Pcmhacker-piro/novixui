import { forwardRef, type InputHTMLAttributes } from "react";
import { Clock } from "lucide-react";
import { cn } from "../utils";

export interface TimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker(
  { className, ...props }, ref,
) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <Clock aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input ref={ref} type="time"
        className={cn(
          "h-9 w-[140px] rounded-md border border-border bg-surface pl-9 pr-3 text-sm shadow-sm outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props} />
    </div>
  );
});
