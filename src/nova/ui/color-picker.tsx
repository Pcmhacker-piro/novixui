import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "../utils";

export interface ColorPickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  swatches?: string[];
}

const DEFAULT_SWATCHES = ["#111827", "#3B82F6", "#8B5CF6", "#EC4899", "#EF4444", "#F97316", "#EAB308", "#10B981", "#06B6D4"];

export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(function ColorPicker(
  { value, onChange, swatches = DEFAULT_SWATCHES, className, disabled, ...props }, ref,
) {
  const [internal, setInternal] = useState<string>(value ?? "#3B82F6");
  const current = value ?? internal;
  const set = (v: string) => { if (value === undefined) setInternal(v); onChange?.(v); };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        <label className="relative inline-block size-10 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border shadow-sm">
          <span aria-hidden className="absolute inset-0" style={{ background: current }} />
          <input ref={ref} type="color" value={current} disabled={disabled}
            onChange={(e) => set(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0" {...props} />
        </label>
        <input type="text" value={current} disabled={disabled}
          onChange={(e) => set(e.target.value)}
          className="h-9 w-32 rounded-md border border-border bg-surface px-3 font-mono text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" />
      </div>
      <div className="flex flex-wrap gap-2">
        {swatches.map((s) => (
          <button key={s} type="button" disabled={disabled} aria-label={`Set color ${s}`}
            onClick={() => set(s)}
            className={cn(
              "size-6 rounded-md border border-border/80 transition-transform hover:scale-110",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              current.toLowerCase() === s.toLowerCase() && "ring-2 ring-primary ring-offset-2 ring-offset-background",
            )}
            style={{ background: s }} />
        ))}
      </div>
    </div>
  );
});
