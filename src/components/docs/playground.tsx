import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/nova/utils";

/**
 * Nova docs · Playground
 *
 * Live control surface: a big preview stage on the left, a stack of
 * labelled controls on the right. Consumers pass a render function that
 * receives the current control state.
 */

export type PlaygroundControl =
  | { kind: "select"; key: string; label: string; options: string[]; defaultValue: string }
  | { kind: "switch"; key: string; label: string; defaultValue: boolean }
  | {
      kind: "slider";
      key: string;
      label: string;
      min: number;
      max: number;
      step?: number;
      defaultValue: number;
      unit?: string;
    };

export type PlaygroundState = Record<string, string | boolean | number>;

export function Playground({
  controls,
  children,
  className,
  stageClassName,
}: {
  controls: PlaygroundControl[];
  children: (state: PlaygroundState) => ReactNode;
  className?: string;
  stageClassName?: string;
}) {
  const initial: PlaygroundState = Object.fromEntries(controls.map((c) => [c.key, c.defaultValue]));
  const [state, setState] = useState<PlaygroundState>(initial);
  const set = (key: string, value: PlaygroundState[string]) =>
    setState((s) => ({ ...s, [key]: value }));

  return (
    <div
      className={cn(
        "nova-card-surface nova-card-moon-edge overflow-hidden rounded-2xl",
        "grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_18rem]",
        className,
      )}
    >
      {/* Stage */}
      <div className="relative border-b border-border/60 md:border-b-0 md:border-r">
        <div aria-hidden className="pointer-events-none absolute inset-0 nova-grid-bg opacity-40" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_60%)]"
        />
        <div
          className={cn(
            "relative flex min-h-[22rem] items-center justify-center p-10",
            stageClassName,
          )}
        >
          <motion.div
            key={JSON.stringify(state)}
            initial={{ opacity: 0.6, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {children(state)}
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-5 bg-surface/50 p-5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Playground
          </p>
          <button
            type="button"
            onClick={() => setState(initial)}
            aria-label="Reset controls"
            className="nova-focus-ring inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-mono text-muted-foreground transition hover:bg-subtle hover:text-foreground"
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>
        {controls.map((c) => (
          <ControlRow
            key={c.key}
            control={c}
            value={state[c.key]}
            onChange={(v) => set(c.key, v)}
          />
        ))}
      </div>
    </div>
  );
}

function ControlRow({
  control,
  value,
  onChange,
}: {
  control: PlaygroundControl;
  value: PlaygroundState[string];
  onChange: (v: PlaygroundState[string]) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[12.5px] font-medium text-foreground">{control.label}</label>
        {control.kind === "slider" && (
          <span className="font-mono text-[11px] text-muted-foreground">
            {String(value)}
            {control.unit ?? ""}
          </span>
        )}
        {control.kind === "select" && (
          <span className="font-mono text-[11px] text-muted-foreground">{String(value)}</span>
        )}
      </div>

      {control.kind === "select" && (
        <div className="flex flex-wrap gap-1 rounded-lg bg-subtle/60 p-1">
          {control.options.map((opt) => {
            const active = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={cn(
                  "nova-focus-ring relative rounded-md px-2 py-1 text-[11.5px] font-medium capitalize transition",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId={`pg-pill-${control.key}`}
                    aria-hidden
                    className="absolute inset-0 -z-0 rounded-md bg-background shadow-[0_1px_0_0_color-mix(in_oklab,white_25%,transparent)_inset,0_1px_2px_0_color-mix(in_oklab,var(--foreground)_10%,transparent)]"
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {control.kind === "switch" && (
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          className={cn(
            "nova-focus-ring relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            value ? "bg-accent" : "bg-subtle border border-border",
          )}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            className={cn(
              "size-5 rounded-full bg-background shadow-[0_1px_2px_rgba(0,0,0,0.25)]",
              value ? "ml-[22px]" : "ml-0.5",
            )}
          />
        </button>
      )}

      {control.kind === "slider" && (
        <input
          type="range"
          min={control.min}
          max={control.max}
          step={control.step ?? 1}
          value={Number(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="nova-focus-ring h-1.5 w-full cursor-pointer appearance-none rounded-full bg-subtle accent-accent"
        />
      )}
    </div>
  );
}
