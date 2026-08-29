import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const inputVariants = cva(
  [
    "flex w-full rounded-md border bg-surface-elevated text-foreground",
    "placeholder:text-muted-foreground",
    "transition-[box-shadow,border-color,background] duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-11 px-4 text-base",
      },
      invalid: {
        true: "border-danger focus-visible:ring-danger",
        false: "border-input hover:border-border-strong",
      },
    },
    defaultVariants: { size: "md", invalid: false },
  },
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Wrapper class for the full field group (label + input + hint). */
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    containerClassName,
    size,
    invalid,
    label,
    hint,
    error,
    leadingIcon,
    trailingIcon,
    id,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const isInvalid = invalid ?? Boolean(error);

  const inputEl = (
    <input
      ref={ref}
      id={inputId}
      aria-invalid={isInvalid || undefined}
      aria-describedby={
        [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
        undefined
      }
      className={cn(
        inputVariants({ size, invalid: isInvalid }),
        (leadingIcon || trailingIcon) && "pl-9",
        trailingIcon && "pr-9",
        className,
      )}
      {...rest}
    />
  );

  const withAffixes =
    leadingIcon || trailingIcon ? (
      <div className="relative">
        {leadingIcon && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground [&_svg]:size-4"
          >
            {leadingIcon}
          </span>
        )}
        {inputEl}
        {trailingIcon && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground [&_svg]:size-4"
          >
            {trailingIcon}
          </span>
        )}
      </div>
    ) : (
      inputEl
    );

  if (!label && !hint && !error) return withAffixes;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      {withAffixes}
      {error ? (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export { inputVariants };
