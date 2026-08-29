import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface ProgressCircleProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
  label?: string;
}

export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(function ProgressCircle(
  { value, max = 100, size = 64, strokeWidth = 6, children, label, className, ...rest }, ref,
) {
  const clamped = Math.min(Math.max(value, 0), max);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / max) * circumference;
  return (
    <div ref={ref}
      role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={clamped} aria-label={label ?? "Progress"}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }} {...rest}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none"
          className="stroke-border" />
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"
          className="stroke-primary transition-[stroke-dashoffset] duration-500 [transition-timing-function:var(--ease-swift)]"
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }} />
      </svg>
      {children !== undefined ? (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">{children}</div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground tabular-nums">
          {Math.round((clamped / max) * 100)}%
        </div>
      )}
    </div>
  );
});
