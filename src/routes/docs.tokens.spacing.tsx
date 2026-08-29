import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { Check, Copy } from "lucide-react";

export const Route = createFileRoute("/docs/tokens/spacing")({
  component: SpacingPage,
  head: () => ({
    meta: [
      { title: "Spacing · Novix UI" },
      { name: "description", content: "The Nova 8px spacing system: predictable rhythm, optical alignment, dense layouts." },
      { property: "og:title", content: "Spacing · Novix UI" },
      { property: "og:description", content: "The Nova 8px spacing system: predictable rhythm, optical alignment, dense layouts." },
      { property: "og:url", content: "/docs/tokens/spacing" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Spacing · Novix UI" },
      { name: "twitter:description", content: "The Nova 8px spacing system: predictable rhythm, optical alignment, dense layouts." },
    ],
    links: [{ rel: "canonical", href: "/docs/tokens/spacing" }],
  }),
});

const SCALE = [
  { token: "0", px: 0, rem: "0rem", use: "Reset" },
  { token: "0.5", px: 2, rem: "0.125rem", use: "Hairline offsets" },
  { token: "1", px: 4, rem: "0.25rem", use: "Icon gaps, tight chips" },
  { token: "2", px: 8, rem: "0.5rem", use: "Inline gaps, compact padding" },
  { token: "3", px: 12, rem: "0.75rem", use: "Dense card padding" },
  { token: "4", px: 16, rem: "1rem", use: "Default padding" },
  { token: "6", px: 24, rem: "1.5rem", use: "Card padding, form gaps" },
  { token: "8", px: 32, rem: "2rem", use: "Section spacing" },
  { token: "12", px: 48, rem: "3rem", use: "Group separators" },
  { token: "16", px: 64, rem: "4rem", use: "Hero blocks" },
  { token: "24", px: 96, rem: "6rem", use: "Page rhythm" },
];

function SpacingPage() {
  return (
    <DocsShell
      eyebrow="Design tokens"
      title="Spacing"
      description="Nova uses a 4px base with an 8px rhythm. Every gap, padding, and margin snaps to the scale — small enough for dense dashboards, generous enough for marketing surfaces."
      toc={[
        { id: "philosophy", label: "Philosophy" },
        { id: "scale", label: "Scale" },
        { id: "visualizer", label: "Visualizer" },
        { id: "usage", label: "Usage" },
        { id: "best-practices", label: "Best practices" },
        { id: "mistakes", label: "Common mistakes" },
      ]}
    >
      <DocSection id="philosophy" title="Philosophy">
        <DocLead>
          Rhythm beats precision. When every value is a multiple of 4, layouts feel intentional
          without a single measurement.
        </DocLead>
        <DocParagraph>
          The scale is geometric where it matters (2, 4, 8, 16) and linear where density counts
          (12, 24). Optical alignment wins over grid-perfect alignment — nudge a caret by 1px
          when the eye asks for it.
        </DocParagraph>
      </DocSection>

      <DocSection id="scale" title="Scale">
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border/70 text-[11.5px] uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Token</th>
                <th className="py-2 pr-4 font-medium">px</th>
                <th className="py-2 pr-4 font-medium">rem</th>
                <th className="py-2 pr-4 font-medium">Use</th>
                <th className="py-2 text-right font-medium">Copy Utility</th>
              </tr>
            </thead>
            <tbody>
              {SCALE.map((s) => (
                <SpacingRow key={s.token} item={s} />
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="visualizer" title="Visualizer">
        <DocParagraph>Each bar's width is its token value. Click any bar to copy its Tailwind padding/gap class.</DocParagraph>
        <div className="nova-card-surface mt-4 space-y-2 rounded-xl p-4">
          {SCALE.filter((s) => s.px > 0).map((s) => (
            <VisualizerBar key={s.token} item={s} />
          ))}
        </div>
      </DocSection>

      <DocSection id="usage" title="Usage">
        <DocParagraph>
          Use Tailwind spacing utilities — they map directly to the scale.
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`<Card className="p-6 space-y-4">
  <div className="flex items-center gap-2">
    <Avatar />
    <span>Ada Lovelace</span>
  </div>
  <p className="text-muted-foreground">Signed in 2 minutes ago</p>
</Card>`}
        />
      </DocSection>

      <DocSection id="best-practices" title="Best practices">
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] text-muted-foreground">
          <li>Prefer <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12px]">gap-*</code> over margins in flex/grid layouts.</li>
          <li>Match padding to density: 3–4 for compact, 6 for default, 8+ for marketing.</li>
          <li>Keep vertical rhythm consistent inside a section (one primary gap value).</li>
        </ul>
      </DocSection>

      <DocSection id="mistakes" title="Common mistakes">
        <Callout variant="warning" title="Off-scale values">
          Avoid arbitrary values like <code className="font-mono">p-[15px]</code>. If a 15px gap
          feels right, the surrounding scale is wrong — adjust the parent, not the child.
        </Callout>
        <Callout variant="note" title="Stacked margins">
          Prefer a parent with <code className="font-mono">space-y-*</code> over per-child
          <code className="font-mono">mb-*</code>. It collapses cleanly and stays predictable.
        </Callout>
      </DocSection>
    </DocsShell>
  );
}

function SpacingRow({ item }: { item: typeof SCALE[number] }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const text = item.token === "0" ? "p-0" : `p-${item.token}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <tr className="border-b border-border/40 hover:bg-surface/50 transition-colors">
      <td className="py-2.5 pr-4 font-mono font-medium">{item.token}</td>
      <td className="py-2.5 pr-4 font-mono text-muted-foreground">{item.px}</td>
      <td className="py-2.5 pr-4 font-mono text-muted-foreground">{item.rem}</td>
      <td className="py-2.5 pr-4 text-muted-foreground">{item.use}</td>
      <td className="py-2.5 text-right">
        <button
          type="button"
          onClick={copy}
          title={`Copy class: p-${item.token}`}
          className="inline-flex h-6 items-center gap-1 rounded border border-border/60 bg-surface px-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-border hover:text-foreground active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 text-[10px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>p-{item.token}</span>
            </>
          )}
        </button>
      </td>
    </tr>
  );
}

function VisualizerBar({ item }: { item: typeof SCALE[number] }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(`gap-${item.token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      onClick={copy}
      title={`Click to copy: gap-${item.token}`}
      className="group flex cursor-pointer items-center gap-3 rounded-lg p-1 transition-colors hover:bg-surface/80"
    >
      <span className="w-10 shrink-0 font-mono text-[12px] text-muted-foreground">{item.token}</span>
      <div
        className="h-3 rounded-sm bg-accent/70 transition-all group-hover:bg-accent group-hover:shadow-[0_0_8px_rgba(var(--accent),0.4)]"
        style={{ width: `${item.px}px` }}
        aria-hidden
      />
      <span className="font-mono text-[11.5px] text-muted-foreground">{item.px}px</span>
      <span className="ml-auto opacity-0 font-mono text-[10px] text-accent transition-opacity group-hover:opacity-100">
        {copied ? "Copied gap-" + item.token : "Copy gap-" + item.token}
      </span>
    </div>
  );
}
