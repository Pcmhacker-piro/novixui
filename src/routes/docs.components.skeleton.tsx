import { createFileRoute } from "@tanstack/react-router";
import { Badge, Skeleton } from "@/nova";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropRow } from "@/components/docs/props-table";
import { Playground } from "@/components/docs/playground";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/components/skeleton")({
  component: SkeletonDoc,
  head: () => ({
    meta: [
      { title: "Skeleton · Novix UI" },
      { name: "description", content: "Placeholder shapes for loading states, with a shimmer that respects motion preferences." },
      { property: "og:title", content: "Skeleton · Novix UI" },
      { property: "og:description", content: "Placeholder shapes for loading states." },
    ],
  }),
});

const PROPS: PropRow[] = [
  { name: "shape", type: `"rect" | "pill" | "circle" | "text"`, default: `"rect"`, description: "Silhouette. Text collapses to line height, circle stays square." },
  { name: "className", type: "string", description: "Size and layout via Tailwind — e.g. h-4 w-32." },
];

function SkeletonDoc() {
  return (
    <DocsShell
      eyebrow="Components · v0.1 · Stable"
      title="Skeleton"
      description="A calm placeholder that suggests the shape of the content that is about to load. Uses a diagonal shimmer that falls back to a pulse for reduced motion."
      toc={[
        { id: "example", label: "Example" },
        { id: "installation", label: "Installation" },
        { id: "when", label: "When to use" },
        { id: "playground", label: "Playground" },
        { id: "shapes", label: "Shapes" },
        { id: "composition", label: "Composition" },
        { id: "api", label: "API" },
        { id: "a11y", label: "Accessibility" },
        { id: "guidelines", label: "Guidelines" },
        { id: "mistakes", label: "Common mistakes" },
        { id: "performance", label: "Performance" },
        { id: "related", label: "Related" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>A card silhouette assembled from skeleton primitives.</DocLead>
        <ComponentPreview
          className="mt-6"
          align="start"
          code={`<div className="w-72 space-y-3">
  <Skeleton shape="circle" className="h-10 w-10" />
  <Skeleton shape="text" className="h-4 w-40" />
  <Skeleton shape="text" className="h-3 w-52" />
</div>`}
        >
          <div className="w-72 space-y-3">
            <Skeleton shape="circle" className="h-10 w-10" />
            <Skeleton shape="text" className="h-4 w-40" />
            <Skeleton shape="text" className="h-3 w-52" />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <DocParagraph>Install and import.</DocParagraph>
        <div className="mt-5 space-y-3">
          <CodeBlock code={`npx @novix-ui/cli add skeleton`} />
          <CodeBlock code={`import { Skeleton } from "@novix-ui/react";`} />
        </div>
      </DocSection>

      <DocSection id="when" title="When to use">
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Use it for</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Initial page and card loads with a stable layout</li>
              <li>Lists where the row count is known</li>
              <li>Image and avatar placeholders</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Reach for something else</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Async work triggered by a user — use a Spinner or button loading state</li>
              <li>Sub-100ms fetches — flashing skeletons feel more distracting than no state</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection id="playground" title="Playground">
        <div className="mt-6">
          <Playground
            controls={[
              { kind: "select", key: "shape", label: "Shape", options: ["rect", "pill", "circle", "text"], defaultValue: "rect" },
            ]}
          >
            {(s) => <Skeleton shape={s.shape as "rect"} className="h-8 w-40" />}
          </Playground>
        </div>
      </DocSection>

      <DocSection id="shapes" title="Shapes">
        <ComponentPreview
          code={`<Skeleton className="h-8 w-32" />
<Skeleton shape="pill" className="h-6 w-24" />
<Skeleton shape="circle" className="h-10 w-10" />
<Skeleton shape="text" className="w-40" />`}
        >
          <Skeleton className="h-8 w-32" />
          <Skeleton shape="pill" className="h-6 w-24" />
          <Skeleton shape="circle" className="h-10 w-10" />
          <Skeleton shape="text" className="w-40" />
        </ComponentPreview>
      </DocSection>

      <DocSection id="composition" title="Composition">
        <p className="text-sm text-muted-foreground">Match the silhouette of the final UI. The user should read the layout during load and not be surprised when data arrives.</p>
        <ComponentPreview
          className="mt-4"
          align="start"
          code={`<div className="nova-card-surface w-80 rounded-xl p-4 space-y-3">
  <div className="flex items-center gap-3">
    <Skeleton shape="circle" className="h-10 w-10" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
  <Skeleton className="h-24 w-full" />
</div>`}
        >
          <div className="nova-card-surface w-80 space-y-3 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Skeleton shape="circle" className="h-10 w-10" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="api" title="API">
        <PropsTable rows={PROPS} />
      </DocSection>

      <DocSection id="a11y" title="Accessibility">
        <Callout variant="accessibility" title="Wrap in a live region">
          Skeletons are visual only. Announce the loading state via <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">aria-busy="true"</code> on the container, and swap to <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">aria-live="polite"</code> once data lands.
        </Callout>
      </DocSection>

      <DocSection id="guidelines" title="Design guidelines">
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {[
            { t: "Match the final silhouette", d: "Skeleton widths should mirror the eventual copy length. Avoid one long bar that suggests a paragraph when the payload is a title." },
            { t: "One motion, not many", d: "The Nova shimmer already runs on every skeleton. Don't add per-item animation on top." },
            { t: "Delay by 100–200ms", d: "Skeletons that appear for 40ms feel like flicker. Debounce the reveal." },
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
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Rendering 30 skeletons at once. The shimmer becomes a strobe. Cap at a viewport-worth.</span></li>
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Using a skeleton for state changes triggered by clicks — use the button's loading state instead.</span></li>
        </ul>
      </DocSection>

      <DocSection id="performance" title="Performance notes">
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          <li>The shimmer is a single CSS animation on a <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">::before</code> pseudo. No JS.</li>
          <li>Under <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">prefers-reduced-motion</code> the shimmer stops and a subtle pulse takes over.</li>
        </ul>
      </DocSection>

      <DocSection id="related" title="Related">
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Spinner", href: "/docs/components/spinner", desc: "Indeterminate progress for user-triggered async." },
            { title: "Card", href: "/docs/components/card", desc: "The most common skeleton container." },
            { title: "Empty states recipe", href: "/docs/recipes/empty-states", desc: "When there's no data to load into." },
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
