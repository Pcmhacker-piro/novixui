import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";
import { Check, Copy } from "lucide-react";

export const Route = createFileRoute("/docs/tokens/typography")({
  component: TypographyPage,
  head: () => ({
    meta: [
      { title: "Typography · Novix UI" },
      { name: "description", content: "Novix UI's type system pairs Geist Sans for UI with Geist Mono for numerics and code." },
      { property: "og:title", content: "Typography · Novix UI" },
      { property: "og:description", content: "Novix UI's type system pairs Geist Sans for UI with Geist Mono for numerics and code." },
    ],
  }),
});

const SCALE = [
  { name: "display", cls: "text-[44px] leading-[1.05] tracking-[-0.03em] font-display font-semibold", sample: "Sculpted, not drawn." },
  { name: "h1", cls: "text-[32px] leading-[1.1] tracking-[-0.025em] font-semibold", sample: "The heading" },
  { name: "h2", cls: "text-[24px] leading-[1.15] tracking-[-0.02em] font-semibold", sample: "The subheading" },
  { name: "body", cls: "text-[15px] leading-relaxed", sample: "Body text carries the weight of every documentation page." },
  { name: "caption", cls: "text-[12.5px] text-muted-foreground", sample: "Caption for metadata and hints" },
  { name: "mono", cls: "font-mono text-[13px]", sample: "npx @novix-ui/cli add button" },
];

function TypographyPage() {
  return (
    <DocsShell
      eyebrow="Design tokens"
      title="Typography"
      description="Novix UI pairs Geist Sans for interface prose with Geist Mono for code and numerics. Every scale step is tuned for optical rhythm — tracking tightens as size grows."
      toc={[
        { id: "scale", label: "Scale" },
        { id: "usage", label: "Usage & code" },
        { id: "principles", label: "Principles" },
      ]}
    >
      <DocSection id="scale" title="Scale">
        <DocLead>Six semantic steps cover every surface in the system. Click any step to copy its classes.</DocLead>
        <div className="mt-6 space-y-4">
          {SCALE.map((s) => (
            <TypeCard key={s.name} item={s} />
          ))}
        </div>
      </DocSection>

      <DocSection id="usage" title="Usage & code">
        <DocParagraph>
          Combine font utilities directly in your JSX markup for consistent typographic hierarchy:
        </DocParagraph>
        <CodeBlock
          className="mt-4"
          code={`// Example: Typographic Hierarchy in JSX
export function ArticleHeader() {
  return (
    <header className="space-y-3">
      <span className="font-mono text-[12.5px] text-accent tracking-wider uppercase">
        Changelog v2.0
      </span>
      <h1 className="font-display text-[44px] font-semibold tracking-tight leading-[1.05] text-foreground">
        Sculpted for modern interfaces.
      </h1>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        Body text formatted with balanced line-height and neutral tracking.
      </p>
    </header>
  );
}`}
        />
      </DocSection>

      <DocSection id="principles" title="Principles">
        <ul className="mt-2 space-y-3 text-sm text-muted-foreground">
          <li>· Body copy sits at 15px. Anything smaller is metadata.</li>
          <li>· Display type gets negative tracking; body stays neutral.</li>
          <li>· Line-height loosens for prose (1.6), tightens for headings (1.05–1.15).</li>
          <li>· Numerals use tabular figures inside tables and dashboards.</li>
        </ul>
      </DocSection>
    </DocsShell>
  );
}

function TypeCard({ item }: { item: typeof SCALE[number] }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(item.cls);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="nova-card-surface group relative rounded-xl p-5 transition-all hover:border-border hover:shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {item.name}
        </span>
        <button
          type="button"
          onClick={copy}
          title="Copy Tailwind class names"
          className="flex h-7 items-center gap-1 rounded border border-border/60 bg-surface px-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-border hover:text-foreground active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 text-[10.5px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy classes</span>
            </>
          )}
        </button>
      </div>
      <p className={item.cls}>{item.sample}</p>
      <p className="mt-3 font-mono text-[11px] text-muted-foreground/60 select-all">{item.cls}</p>
    </div>
  );
}
