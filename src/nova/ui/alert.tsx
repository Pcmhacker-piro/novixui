import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground border-border",
        info: "bg-sky-500/5 border-sky-500/30 text-foreground [&>svg]:text-sky-500",
        success: "bg-emerald-500/5 border-emerald-500/30 text-foreground [&>svg]:text-emerald-500",
        warning: "bg-amber-500/5 border-amber-500/30 text-foreground [&>svg]:text-amber-500",
        destructive: "bg-red-500/5 border-red-500/30 text-foreground [&>svg]:text-red-500",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface AlertProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, variant, ...props }, ref,
) {
  return <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
});

export const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground [&_p]:leading-relaxed", className)} {...props} />
  ),
);
AlertDescription.displayName = "AlertDescription";

export { alertVariants };
