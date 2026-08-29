import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "../utils";

export interface StatisticProps extends Omit<HTMLAttributes<HTMLDivElement>, "prefix"> {
  label: string;
  value: ReactNode;
  hint?: string;
  delta?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const Statistic = forwardRef<HTMLDivElement, StatisticProps>(function Statistic(
  { label, value, hint, delta, prefix, suffix, className, ...rest }, ref,
) {
  const positive = typeof delta === "number" && delta >= 0;
  return (
    <div ref={ref} className={cn("space-y-1", className)} {...rest}>
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
          {prefix}{value}{suffix}
        </div>
        {typeof delta === "number" && (
          <span className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
            positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500",
          )}>
            {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
});
