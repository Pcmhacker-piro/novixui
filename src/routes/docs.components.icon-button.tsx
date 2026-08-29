import { createFileRoute } from "@tanstack/react-router";
import { Bell, Heart, Search, Settings, Trash2 } from "lucide-react";
import { Badge, IconButton } from "@/nova";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropRow } from "@/components/docs/props-table";
import { Playground } from "@/components/docs/playground";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/components/icon-button")({
  component: IconButtonDoc,
  head: () => ({
    meta: [
      { title: "IconButton · Novix UI" },
      { name: "description", content: "Square icon-only action. Enforces aria-label at the type level." },
      { property: "og:title", content: "IconButton · Novix UI" },
      { property: "og:description", content: "Icon-only actions that can't ship without an accessible name." },
    ],
  }),
});

const PROPS: PropRow[] = [
  { name: "aria-label", type: "string", description: "Required — the accessible name. Enforced at the type level." },
  { name: "variant", type: `"primary" | "accent" | "secondary" | "ghost" | "outline" | "destructive"`, default: `"ghost"`, description: "Visual intent." },
  { name: "size", type: `"xs" | "sm" | "md" | "lg" | "xl"`, default: `"md"`, description: "Square footprint sized to the icon." },
  { name: "asChild", type: "boolean", default: "false", description: "Render onto a child (link, menu trigger, etc.)." },
  { name: "loading", type: "boolean", default: "false", description: "Swap the icon for a spinner and set aria-busy." },
];

function IconButtonDoc() {
  return (
    <DocsShell
      eyebrow="Components · v0.1 · Stable"
      title="IconButton"
      description="A single-tap square action for toolbars, table rows, and headers. The type signature refuses to compile without an aria-label — icon buttons can never ship without a name."
      toc={[
        { id: "example", label: "Example" },
        { id: "installation", label: "Installation" },
        { id: "when", label: "When to use" },
        { id: "playground", label: "Playground" },
        { id: "variants", label: "Variants" },
        { id: "sizes", label: "Sizes" },
        { id: "api", label: "API" },
        { id: "keyboard", label: "Keyboard" },
        { id: "a11y", label: "Accessibility" },
        { id: "guidelines", label: "Guidelines" },
        { id: "mistakes", label: "Common mistakes" },
        { id: "related", label: "Related" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>A ghost icon action — the most common footprint in toolbars.</DocLead>
        <ComponentPreview className="mt-6" code={`<IconButton aria-label="Search"><Search /></IconButton>`}>
          <IconButton aria-label="Search"><Search /></IconButton>
        </ComponentPreview>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <DocParagraph>Install and import.</DocParagraph>
        <div className="mt-5 space-y-3">
          <CodeBlock code={`npx @novix-ui/cli add icon-button`} />
          <CodeBlock code={`import { IconButton } from "@novix-ui/react";`} />
        </div>
      </DocSection>

      <DocSection id="when" title="When to use">
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Reach for it when</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Space is tight and the meaning is universal (search, close, settings)</li>
              <li>You need a dense toolbar of parallel actions</li>
              <li>The action is repeated per row in a table</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Reach for something else</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>The action needs a label to be understood — use Button</li>
              <li>The icon is decorative — put it inside a Button with a text label</li>
              <li>The control toggles state — use a Switch or ToggleButton (soon)</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection id="playground" title="Playground">
        <div className="mt-6">
          <Playground
            controls={[
              { kind: "select", key: "variant", label: "Variant", options: ["primary", "accent", "secondary", "ghost", "outline", "destructive"], defaultValue: "ghost" },
              { kind: "select", key: "size", label: "Size", options: ["xs", "sm", "md", "lg", "xl"], defaultValue: "md" },
              { kind: "switch", key: "loading", label: "Loading", defaultValue: false },
              { kind: "switch", key: "disabled", label: "Disabled", defaultValue: false },
            ]}
          >
            {(s) => (
              <IconButton
                aria-label="Notifications"
                variant={s.variant as "ghost"}
                size={s.size as "md"}
                loading={Boolean(s.loading)}
                disabled={Boolean(s.disabled)}
              >
                <Bell />
              </IconButton>
            )}
          </Playground>
        </div>
      </DocSection>

      <DocSection id="variants" title="Variants">
        <ComponentPreview
          code={`<IconButton aria-label="Search"><Search /></IconButton>
<IconButton variant="primary" aria-label="Settings"><Settings /></IconButton>
<IconButton variant="destructive" aria-label="Delete"><Trash2 /></IconButton>
<IconButton variant="outline" aria-label="Favorite"><Heart /></IconButton>`}
        >
          <IconButton aria-label="Search"><Search /></IconButton>
          <IconButton variant="primary" aria-label="Settings"><Settings /></IconButton>
          <IconButton variant="destructive" aria-label="Delete"><Trash2 /></IconButton>
          <IconButton variant="outline" aria-label="Favorite"><Heart /></IconButton>
        </ComponentPreview>
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <ComponentPreview
          code={`<IconButton size="xs" aria-label="Search"><Search /></IconButton>
<IconButton size="sm" aria-label="Search"><Search /></IconButton>
<IconButton size="md" aria-label="Search"><Search /></IconButton>
<IconButton size="lg" aria-label="Search"><Search /></IconButton>
<IconButton size="xl" aria-label="Search"><Search /></IconButton>`}
        >
          <IconButton size="xs" aria-label="Search"><Search /></IconButton>
          <IconButton size="sm" aria-label="Search"><Search /></IconButton>
          <IconButton size="md" aria-label="Search"><Search /></IconButton>
          <IconButton size="lg" aria-label="Search"><Search /></IconButton>
          <IconButton size="xl" aria-label="Search"><Search /></IconButton>
        </ComponentPreview>
      </DocSection>

      <DocSection id="api" title="API">
        <PropsTable rows={PROPS} />
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><code className="rounded bg-subtle px-1 font-mono text-[12.5px]">Tab</code> — focus the button</li>
          <li><code className="rounded bg-subtle px-1 font-mono text-[12.5px]">Enter / Space</code> — activate</li>
        </ul>
      </DocSection>

      <DocSection id="a11y" title="Accessibility">
        <Callout variant="accessibility" title="aria-label is required at the type level">
          The prop is typed as required, so the compiler blocks any icon button without a name.
        </Callout>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>Rendered as a native <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">&lt;button&gt;</code> unless <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">asChild</code>.</li>
          <li>Loading applies <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">aria-busy</code>.</li>
          <li>Focus ring is two-layer for contrast on any surface.</li>
        </ul>
      </DocSection>

      <DocSection id="guidelines" title="Design guidelines">
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {[
            { t: "Universal icons only", d: "Icon-only means the icon must communicate on its own. Custom icons need a text label." },
            { t: "Consistent size per surface", d: "Pick one IconButton size for the toolbar and stick to it. Mixing feels sloppy." },
            { t: "Group related actions", d: "Use a Separator between semantic clusters (edit tools vs. destructive tools)." },
            { t: "Tooltip for the label", d: "Add a Tooltip (soon) that mirrors aria-label. Never a different string." },
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
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Passing text as children — IconButton is icon-only. Use <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">Button</code> when a label is needed.</span></li>
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Sizing icons manually. The component sizes SVG children automatically per <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">size</code>.</span></li>
        </ul>
      </DocSection>

      <DocSection id="related" title="Related">
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Button", href: "/docs/components/button", desc: "Text-first action with icons.", status: "stable" },
            { title: "Kbd", href: "/docs/components/kbd", desc: "Render the keyboard shortcut beside it.", status: "stable" },
            { title: "Separator", href: "/docs/components/separator", desc: "Group toolbars into clusters.", status: "stable" },
          ].map((r) => (
            <a key={r.href} href={r.href} className="nova-card-surface group block rounded-xl p-4 transition hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{r.title}</p>
                <Badge variant="outline" size="sm">{r.status}</Badge>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{r.desc}</p>
            </a>
          ))}
        </div>
      </DocSection>
    </DocsShell>
  );
}
