import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bell, CheckCircle2, Search, Sparkles } from "lucide-react";
import { Badge, Icon } from "@/nova";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropRow } from "@/components/docs/props-table";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/components/icon")({
  component: IconDoc,
  head: () => ({
    meta: [
      { title: "Icon · Novix UI" },
      { name: "description", content: "Type-safe wrapper around lucide-react with semantic sizes and enforced accessibility." },
      { property: "og:title", content: "Icon · Novix UI" },
      { property: "og:description", content: "Type-safe icon wrapper with enforced a11y." },
    ],
  }),
});

const PROPS: PropRow[] = [
  { name: "icon", type: "LucideIcon", description: "Any icon component exported by lucide-react." },
  { name: "size", type: `"xs" | "sm" | "md" | "lg" | "xl" | number`, default: `"md"`, description: "Semantic size token or a raw pixel value." },
  { name: "decorative", type: "boolean", default: "true", description: "When true, hides from assistive tech (aria-hidden)." },
  { name: "label", type: "string", description: "Required when decorative is false. Becomes the accessible name." },
];

function IconDoc() {
  return (
    <DocsShell
      eyebrow="Components · v0.1 · Stable"
      title="Icon"
      description="A thin wrapper around lucide-react that enforces the two rules every icon system fails at: consistent sizes across the app, and correct accessibility whenever an icon carries meaning."
      toc={[
        { id: "example", label: "Example" },
        { id: "installation", label: "Installation" },
        { id: "when", label: "When to use" },
        { id: "sizes", label: "Sizes" },
        { id: "meaning", label: "Decorative vs. meaningful" },
        { id: "api", label: "API" },
        { id: "a11y", label: "Accessibility" },
        { id: "guidelines", label: "Guidelines" },
        { id: "mistakes", label: "Common mistakes" },
        { id: "related", label: "Related" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>A decorative icon inline with text.</DocLead>
        <ComponentPreview className="mt-6" code={`<Icon icon={Sparkles} />`}>
          <Icon icon={Sparkles} />
        </ComponentPreview>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <DocParagraph>Install and import from Nova. Lucide is a peer dependency.</DocParagraph>
        <div className="mt-5 space-y-3">
          <CodeBlock code={`bun add lucide-react`} />
          <CodeBlock code={`import { Icon } from "@novix-ui/react";
import { Sparkles } from "lucide-react";`} />
        </div>
      </DocSection>

      <DocSection id="when" title="When to use">
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Use it for</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Any lucide icon inside your app UI</li>
              <li>Icons in menu rows, cards, and empty states</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Skip it for</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Icons already inside Button, IconButton, Input — they size for you</li>
              <li>Custom SVGs — inline them directly and set aria attributes by hand</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <ComponentPreview
          code={`<Icon icon={Bell} size="xs" />
<Icon icon={Bell} size="sm" />
<Icon icon={Bell} size="md" />
<Icon icon={Bell} size="lg" />
<Icon icon={Bell} size="xl" />
<Icon icon={Bell} size={32} />`}
        >
          <Icon icon={Bell} size="xs" />
          <Icon icon={Bell} size="sm" />
          <Icon icon={Bell} size="md" />
          <Icon icon={Bell} size="lg" />
          <Icon icon={Bell} size="xl" />
          <Icon icon={Bell} size={32} />
        </ComponentPreview>
      </DocSection>

      <DocSection id="meaning" title="Decorative vs. meaningful">
        <p className="text-sm text-muted-foreground">If the icon adds meaning that text does not, it needs a label. If it's redundant with adjacent copy, it stays decorative.</p>
        <ComponentPreview
          className="mt-4"
          code={`<Icon icon={CheckCircle2} decorative={false} label="Success" />
<span className="inline-flex items-center gap-2">
  <Icon icon={ArrowRight} /> Continue
</span>`}
        >
          <Icon icon={CheckCircle2} decorative={false} label="Success" className="text-success" />
          <span className="inline-flex items-center gap-2 text-sm">
            <Icon icon={ArrowRight} /> Continue
          </span>
        </ComponentPreview>
      </DocSection>

      <DocSection id="api" title="API">
        <PropsTable rows={PROPS} />
      </DocSection>

      <DocSection id="a11y" title="Accessibility">
        <Callout variant="accessibility" title="Every meaningful icon needs a label">
          The Icon component throws a friendly console warning in development when <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">decorative=false</code> without a <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">label</code>. Decorative icons render with <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">aria-hidden</code>.
        </Callout>
      </DocSection>

      <DocSection id="guidelines" title="Design guidelines">
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {[
            { t: "One weight per surface", d: "Nova sets stroke-width 1.75 across all icons. Don't mix stroke variants in the same view." },
            { t: "Size follows text", d: "Menu row = sm, section title = md, hero eyebrow = lg. Match the neighboring text." },
            { t: "Color inherits currentColor", d: "Style the parent, not the icon. This keeps hover and state changes coherent." },
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
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Passing a JSX element instead of the component reference — pass <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">{`icon={Search}`}</code>, not <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">{`icon={<Search />}`}</code>.</span></li>
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Setting fixed pixel color — use <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">text-*</code> on the parent.</span></li>
        </ul>
      </DocSection>

      <DocSection id="related" title="Related">
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {[
            { title: "IconButton", href: "/docs/components/icon-button", desc: "Icons that act." },
            { title: "Button", href: "/docs/components/button", desc: "Icons beside a label." },
            { title: "Design principles", href: "/docs/design-principles", desc: "Iconography rules." },
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
