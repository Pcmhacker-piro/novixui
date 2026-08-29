import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, className, ...rest }, ref,
) {
  return (
    <div ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/50 p-10 text-center",
        className,
      )}
      {...rest}>
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-subtle text-muted-foreground [&_svg]:size-6">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
});
