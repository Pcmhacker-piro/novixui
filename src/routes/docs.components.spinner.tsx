import { createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Spinner } from "@/nova";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropRow } from "@/components/docs/props-table";
import { Playground } from "@/components/docs/playground";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/components/spinner")({
  component: SpinnerDoc,
  head: () => ({
    meta: [
      { title: "Spinner · Novix UI" },
      { name: "description", content: "Indeterminate progress indicator sized to context, tuned for reduced motion." },
      { property: "og:title", content: "Spinner · Novix UI" },
      { property: "og:description", content: "Indeterminate progress indicator." },
    ],
  }),
});

const PROPS: PropRow[] = [
  { name: "size", type: `"xs" | "sm" | "md" | "lg" | "xl" | "inherit"`, default: `"md"`, description: "Diameter. Use inherit to scale with surrounding font-size." },
  { name: "tone", type: `"current" | "muted" | "accent" | "primary"`, default: `"current"`, description: "Stroke color. Defaults to text color." },
  { name: "label", type: "string", default: `"Loading"`, description: "Screen-reader label announced via aria-label." },
];

function SpinnerDoc() {
  return (
    <DocsShell
      eyebrow="Components · v0.1 · Stable"
      title="Spinner"
      description="A single SVG spinner for indeterminate progress — sub-2KB, tuned for reduced motion, and sized in em so it reads at any typography scale."
      toc={[
        { id: "example", label: "Example" },
        { id: "installation", label: "Installation" },
        { id: "when", label: "When to use" },
        { id: "playground", label: "Playground" },
        { id: "sizes", label: "Sizes" },
        { id: "tones", label: "Tones" },
        { id: "inline", label: "Inline usage" },
        { id: "api", label: "API" },
        { id: "a11y", label: "Accessibility" },
        { id: "guidelines", label: "Guidelines" },
        { id: "mistakes", label: "Common mistakes" },
        { id: "related", label: "Related" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>A default spinner announces "Loading" to assistive tech.</DocLead>
        <ComponentPreview className="mt-6" code={`<Spinner />`}>
          <Spinner />
        </ComponentPreview>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <DocParagraph>Install and import.</DocParagraph>
        <div className="mt-5 space-y-3">
          <CodeBlock code={`npx @novix-ui/cli add spinner`} />
          <CodeBlock code={`import { Spinner } from "@novix-ui/react";`} />
        </div>
      </DocSection>

      <DocSection id="when" title="When to use">
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Use it for</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Any async initiated by user input</li>
              <li>Streaming AI responses (with a Thinking indicator, later)</li>
              <li>Foreground network requests</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Skip it for</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Full-page or layout-known loads — Skeleton is stiller and less anxious</li>
              <li>Background sync — use a small dot indicator</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection id="playground" title="Playground">
        <div className="mt-6">
          <Playground
            controls={[
              { kind: "select", key: "size", label: "Size", options: ["xs", "sm", "md", "lg", "xl"], defaultValue: "md" },
              { kind: "select", key: "tone", label: "Tone", options: ["current", "muted", "accent", "primary"], defaultValue: "current" },
            ]}
          >
            {(s) => <Spinner size={s.size as "md"} tone={s.tone as "current"} />}
          </Playground>
        </div>
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <ComponentPreview
          code={`<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`}
        >
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </ComponentPreview>
      </DocSection>

      <DocSection id="tones" title="Tones">
        <ComponentPreview
          code={`<Spinner tone="current" />
<Spinner tone="muted" />
<Spinner tone="accent" />
<Spinner tone="primary" />`}
        >
          <Spinner tone="current" />
          <Spinner tone="muted" />
          <Spinner tone="accent" />
          <Spinner tone="primary" />
        </ComponentPreview>
      </DocSection>

      <DocSection id="inline" title="Inline usage">
        <p className="text-sm text-muted-foreground">Use <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">size="inherit"</code> to scale with the surrounding text.</p>
        <ComponentPreview
          className="mt-4"
          code={`<p className="text-sm inline-flex items-center gap-2">
  <Spinner size="inherit" /> Publishing…
</p>
<Button loading>Saving</Button>`}
        >
          <p className="inline-flex items-center gap-2 text-sm">
            <Spinner size="inherit" /> Publishing…
          </p>
          <Button loading>Saving</Button>
        </ComponentPreview>
      </DocSection>

      <DocSection id="api" title="API">
        <PropsTable rows={PROPS} />
      </DocSection>

      <DocSection id="a11y" title="Accessibility">
        <Callout variant="accessibility" title="Announce progress once, not on every tick">
          The spinner sets <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">role="status"</code> and <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">aria-live="polite"</code>. Once the async work resolves, remove the spinner and announce the outcome in the same live region.
        </Callout>
      </DocSection>

      <DocSection id="guidelines" title="Design guidelines">
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {[
            { t: "Match text size", d: "In a button, use size=inherit so the ring aligns with the label baseline." },
            { t: "Don't stack spinners", d: "One canonical indicator per view. Stacking reads as broken UI." },
            { t: "Debounce below 200ms", d: "Instant work shouldn't spin. Delay the reveal until the wait is real." },
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
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Sizing with <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">height</code> in pixels — use the size prop so tone and stroke stay in sync.</span></li>
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Wrapping in a div with <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">aria-hidden</code>. The spinner already exposes progress semantics.</span></li>
        </ul>
      </DocSection>

      <DocSection id="related" title="Related">
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Button", href: "/docs/components/button", desc: "loading swaps in a Spinner automatically." },
            { title: "Skeleton", href: "/docs/components/skeleton", desc: "For layout-known loads." },
            { title: "IconButton", href: "/docs/components/icon-button", desc: "Same loading contract as Button." },
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
