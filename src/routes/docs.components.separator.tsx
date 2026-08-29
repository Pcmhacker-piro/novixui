import { createFileRoute } from "@tanstack/react-router";
import { Badge, Separator } from "@/nova";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropRow } from "@/components/docs/props-table";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/components/separator")({
  component: SeparatorDoc,
  head: () => ({
    meta: [
      { title: "Separator · Novix UI" },
      { name: "description", content: "Semantic divider — horizontal or vertical — built on Radix." },
      { property: "og:title", content: "Separator · Novix UI" },
      { property: "og:description", content: "Semantic divider with correct ARIA orientation." },
    ],
  }),
});

const PROPS: PropRow[] = [
  { name: "orientation", type: `"horizontal" | "vertical"`, default: `"horizontal"`, description: "Layout direction." },
  { name: "decorative", type: "boolean", default: "true", description: "When true, hides from assistive tech (recommended when adjacent content already implies a boundary)." },
];

function SeparatorDoc() {
  return (
    <DocsShell
      eyebrow="Components · v0.1 · Stable"
      title="Separator"
      description="A one-pixel semantic divider — the quietest primitive in the system. Use it to segment ideas, not to decorate them."
      toc={[
        { id: "example", label: "Example" },
        { id: "installation", label: "Installation" },
        { id: "when", label: "When to use" },
        { id: "orientation", label: "Orientation" },
        { id: "api", label: "API" },
        { id: "a11y", label: "Accessibility" },
        { id: "guidelines", label: "Guidelines" },
        { id: "mistakes", label: "Common mistakes" },
        { id: "related", label: "Related" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>A horizontal divider between two blocks of text.</DocLead>
        <ComponentPreview
          className="mt-6"
          align="start"
          code={`<div className="w-72">
  <p>Account</p>
  <Separator className="my-3" />
  <p className="text-muted-foreground">Billing</p>
</div>`}
        >
          <div className="w-72">
            <p className="text-sm">Account</p>
            <Separator className="my-3" />
            <p className="text-sm text-muted-foreground">Billing</p>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <DocParagraph>Install and import.</DocParagraph>
        <div className="mt-5 space-y-3">
          <CodeBlock code={`npx @novix-ui/cli add separator`} />
          <CodeBlock code={`import { Separator } from "@novix-ui/react";`} />
        </div>
      </DocSection>

      <DocSection id="when" title="When to use">
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Use it for</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Menu groupings</li>
              <li>Setting sections inside a Card</li>
              <li>Toolbars — grouping related IconButtons</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Skip it when</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Whitespace already communicates the group boundary</li>
              <li>Between Cards — the elevation is already the separator</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection id="orientation" title="Orientation">
        <ComponentPreview
          code={`<div className="flex h-8 items-center gap-4">
  <span>Home</span>
  <Separator orientation="vertical" />
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>Blog</span>
</div>`}
        >
          <div className="flex h-8 items-center gap-4 text-sm">
            <span>Home</span>
            <Separator orientation="vertical" />
            <span>Docs</span>
            <Separator orientation="vertical" />
            <span>Blog</span>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="api" title="API">
        <PropsTable rows={PROPS} />
      </DocSection>

      <DocSection id="a11y" title="Accessibility">
        <Callout variant="accessibility" title="Decorative by default">
          When the divider is purely visual (between adjacent labeled sections), the default <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">decorative</code> mode keeps it out of the accessibility tree. Set it to <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">false</code> when the divider is the only cue that separates two regions.
        </Callout>
      </DocSection>

      <DocSection id="guidelines" title="Design guidelines">
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {[
            { t: "Prefer whitespace first", d: "If a 24px gap already tells the story, the line is noise." },
            { t: "Vertical needs a container height", d: "Separators inherit height from the flex row. Give the row a fixed height (e.g. h-6)." },
            { t: "Never full opacity", d: "The line lives at 6–10% of the foreground. Nova ships this pre-tuned." },
          ].map((g) => (
            <div key={g.t} className="nova-card-surface rounded-xl p-4">
              <p className="text-sm font-semibold">{g.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{g.d}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="mistakes" title="Common mistakes">
        <ul className="mt-2 space-y-3 text-sm">
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Using a Separator inside every list — density becomes a picket fence. Group in threes.</span></li>
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Rendering vertical without height. It collapses to a dot.</span></li>
        </ul>
      </DocSection>

      <DocSection id="related" title="Related">
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Card", href: "/docs/components/card", desc: "Segment settings inside a Card." },
            { title: "IconButton", href: "/docs/components/icon-button", desc: "Group toolbar actions." },
            { title: "Design principles", href: "/docs/design-principles", desc: "Rhythm and whitespace." },
          ].map((r) => (
            <a key={r.href} href={r.href} className="nova-card-surface group block rounded-xl p-4 transition hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{r.title}</p>
                <Badge variant="outline" size="sm">stable</Badge>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{r.desc}</p>
            </a>
          ))}
        </div>
      </DocSection>
    </DocsShell>
  );
}
