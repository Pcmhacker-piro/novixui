import { type ReactNode } from "react";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout, type CalloutVariant } from "./callout";

export type MappingRow = { from: string; to: string; notes?: string };

/**
 * Nova docs · Migration page — consistent shell across every source library.
 * Sections: install → mapping table → code diff → traps → related.
 */
export function MigrationPage({
  eyebrow,
  title,
  description,
  overview,
  install,
  mapping,
  diffBefore,
  diffAfter,
  traps,
  callouts,
}: {
  eyebrow: string;
  title: string;
  description: string;
  overview: ReactNode;
  install: string;
  mapping: MappingRow[];
  diffBefore: string;
  diffAfter: string;
  traps: string[];
  callouts?: { variant: CalloutVariant; title: string; body: string }[];
}) {
  return (
    <DocsShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "install", label: "Install" },
        { id: "mapping", label: "Mapping" },
        { id: "diff", label: "Code diff" },
        { id: "traps", label: "Common traps" },
      ]}
    >
      <DocSection id="overview" title="Overview">
        <DocLead>{overview}</DocLead>
      </DocSection>

      <DocSection id="install" title="Install alongside">
        <p className="text-sm text-muted-foreground">Add Nova without removing your current library. Migrate page-by-page.</p>
        <CodeBlock className="mt-3" code={install} />
      </DocSection>

      <DocSection id="mapping" title="Component mapping">
        <div className="mt-3 overflow-x-auto rounded-xl border border-border/70">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-subtle/60">
              <tr>
                <th className="px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">From</th>
                <th className="px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Nova</th>
                <th className="px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody>
              {mapping.map((row, i) => (
                <tr key={row.from} className={i > 0 ? "border-t border-border/60" : ""}>
                  <td className="px-4 py-2 font-mono text-[12.5px]">{row.from}</td>
                  <td className="px-4 py-2 font-mono text-[12.5px] text-accent">{row.to}</td>
                  <td className="px-4 py-2 text-muted-foreground">{row.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="diff" title="Code diff">
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Before</p>
            <CodeBlock code={diffBefore} />
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">After (Nova)</p>
            <CodeBlock code={diffAfter} />
          </div>
        </div>
      </DocSection>

      <DocSection id="traps" title="Common traps">
        <ul className="mt-2 space-y-3 text-sm">
          {traps.map((t) => (
            <li key={t} className="flex gap-3">
              <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-warning" />
              <span className="text-muted-foreground">{t}</span>
            </li>
          ))}
        </ul>
        {callouts?.length ? (
          <div className="mt-6 space-y-3">
            {callouts.map((c) => (
              <Callout key={c.title} variant={c.variant} title={c.title}>
                {c.body}
              </Callout>
            ))}
          </div>
        ) : null}
      </DocSection>
    </DocsShell>
  );
}
