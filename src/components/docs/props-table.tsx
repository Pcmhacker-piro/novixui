import { cn } from "@/nova/utils";

export type PropRow = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
};

/**
 * Nova docs · PropsTable
 *
 * A quiet, monospace-typed reference table. No zebra stripes, no borders
 * fighting for attention — just clean rows separated by hairlines and
 * generous vertical rhythm.
 */
export function PropsTable({ rows, className }: { rows: PropRow[]; className?: string }) {
  return (
    <div
      className={cn("overflow-hidden rounded-xl border border-border/70 bg-surface/40", className)}
    >
      <div className="grid grid-cols-[minmax(140px,1fr)_minmax(180px,1.4fr)_minmax(90px,0.8fr)_minmax(220px,2fr)] gap-x-4 border-b border-border/70 bg-subtle/50 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
        <div>Prop</div>
        <div>Type</div>
        <div>Default</div>
        <div>Description</div>
      </div>
      <ul className="divide-y divide-border/60">
        {rows.map((r) => (
          <li
            key={r.name}
            className="grid grid-cols-[minmax(140px,1fr)_minmax(180px,1.4fr)_minmax(90px,0.8fr)_minmax(220px,2fr)] gap-x-4 px-4 py-3.5"
          >
            <div className="flex items-center gap-1.5">
              <code className="rounded-[5px] bg-subtle px-1.5 py-0.5 font-mono text-[12.5px] text-foreground">
                {r.name}
              </code>
              {r.required && (
                <span
                  aria-label="required"
                  title="Required"
                  className="text-[10px] font-mono text-danger"
                >
                  *
                </span>
              )}
            </div>
            <div className="font-mono text-[12.5px] text-accent/90 break-words">{r.type}</div>
            <div className="font-mono text-[12.5px] text-muted-foreground">{r.default ?? "—"}</div>
            <div className="text-sm leading-relaxed text-muted-foreground">{r.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
