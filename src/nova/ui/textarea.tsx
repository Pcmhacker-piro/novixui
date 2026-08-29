import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props }, ref,
) {
  return (
    <textarea ref={ref}
      className={cn(
        "flex min-h-20 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm shadow-sm",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props} />
  );
});
