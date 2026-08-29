import { forwardRef, type HTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "../utils";

export interface StepperStep {
  label: string;
  description?: string;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  steps: StepperStep[];
  current: number;
  orientation?: "horizontal" | "vertical";
}

export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, current, orientation = "horizontal", className, ...rest }, ref,
) {
  const isH = orientation === "horizontal";
  return (
    <ol ref={ref} className={cn(isH ? "flex items-start gap-3" : "flex flex-col gap-4", className)} {...(rest as HTMLAttributes<HTMLOListElement>)}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.label} className={cn(isH ? "flex flex-1 items-start gap-3" : "flex items-start gap-3", "min-w-0")}>
            <div className="flex flex-col items-center">
              <div
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors [transition-timing-function:var(--ease-swift)]",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent)]",
                  !done && !active && "border-border bg-surface text-muted-foreground",
                )}>
                {done ? <Check className="size-4" /> : i + 1}
              </div>
              {!isH && i < steps.length - 1 && (
                <div className={cn("mt-1 w-px flex-1 min-h-6", done ? "bg-primary" : "bg-border")} />
              )}
            </div>
            <div className="min-w-0 pt-1">
              <div className={cn("text-sm font-medium", active ? "text-foreground" : "text-muted-foreground")}>{step.label}</div>
              {step.description && <div className="text-xs text-muted-foreground">{step.description}</div>}
            </div>
            {isH && i < steps.length - 1 && (
              <div aria-hidden className={cn("mt-4 h-px flex-1", done ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
});
