import { forwardRef } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "../utils";

export interface Step {
  id: string;
  title: string;
  description?: string;
}

export interface StepsProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: Step[];
  /** Zero-based index of the currently active step. */
  current: number;
}

export const Steps = forwardRef<HTMLOListElement, StepsProps>(
  ({ steps, current, className, ...props }, ref) => (
    <ol ref={ref} className={cn("flex w-full items-start gap-3", className)} {...props}>
      {steps.map((step, idx) => {
        const state = idx < current ? "complete" : idx === current ? "current" : "upcoming";
        return (
          <li key={step.id} className="flex flex-1 items-start gap-3">
            <div className="flex flex-col items-center">
              <motion.span
                initial={false}
                animate={{
                  scale: state === "current" ? 1.08 : 1,
                }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold",
                  state === "complete" &&
                    "border-transparent bg-primary text-primary-foreground shadow-[0_0_20px_-4px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
                  state === "current" &&
                    "border-primary bg-background text-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_15%,transparent),0_0_28px_-6px_color-mix(in_oklab,var(--primary)_55%,transparent)]",
                  state === "upcoming" && "border-border bg-surface text-muted-foreground",
                )}
              >
                {state === "complete" ? <Check className="h-4 w-4" strokeWidth={3} /> : idx + 1}
              </motion.span>
            </div>
            <div className="mt-1 min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  state === "upcoming" ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
              )}
            </div>
            {idx < steps.length - 1 && (
              <div
                aria-hidden
                className="mt-4 h-px flex-1 overflow-hidden rounded-full bg-border/60"
              >
                <motion.div
                  initial={false}
                  animate={{ scaleX: idx < current ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  style={{ transformOrigin: "left" }}
                  className="h-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  ),
);
Steps.displayName = "Steps";
