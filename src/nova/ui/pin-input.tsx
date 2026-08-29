import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { useContext } from "react";
import { cn } from "../utils";

export const PinInput = forwardRef<
  React.ElementRef<typeof OTPInput>,
  ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput ref={ref}
    containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props} />
));
PinInput.displayName = "PinInput";

export const PinInputGroup = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center gap-1.5", className)} {...props} />,
);
PinInputGroup.displayName = "PinInputGroup";

export interface PinInputSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}
export const PinInputSlot = forwardRef<HTMLDivElement, PinInputSlotProps>(({ index, className, ...props }, ref) => {
  const ctx = useContext(OTPInputContext);
  const slot = ctx?.slots?.[index] ?? { char: "", hasFakeCaret: false, isActive: false };
  return (
    <div ref={ref}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-md border border-border bg-surface text-base font-medium text-foreground shadow-sm transition-all",
        slot.isActive && "z-10 ring-2 ring-ring ring-offset-2 ring-offset-background border-primary",
        className,
      )}
      {...props}>
      {slot.char}
      {slot.hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-foreground" />
        </div>
      )}
    </div>
  );
});
PinInputSlot.displayName = "PinInputSlot";
