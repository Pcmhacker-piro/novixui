import { createFileRoute } from "@tanstack/react-router";
import { Badge, Kbd, KbdSequence } from "@/nova";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropRow } from "@/components/docs/props-table";
import { Playground } from "@/components/docs/playground";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/components/kbd")({
  component: KbdDoc,
  head: () => ({
    meta: [
      { title: "Kbd · Novix UI" },
      { name: "description", content: "Semantic key caps. Compose with KbdSequence for platform-aware shortcuts." },
      { property: "og:title", content: "Kbd · Novix UI" },
      { property: "og:description", content: "Semantic key caps for shortcuts, hotkeys, and menus." },
    ],
  }),
});

const PROPS: PropRow[] = [
  { name: "size", type: `"xs" | "sm" | "md" | "lg"`, default: `"md"`, description: "Cap size." },
  { name: "tone", type: `"default" | "subtle" | "inverted"`, default: `"default"`, description: "Surface treatment." },
  { name: "pressed", type: "boolean", default: "false", description: "Sink the cap to reflect an active/held state." },
];

const SEQUENCE_PROPS: PropRow[] = [
  { name: "keys", type: "(string | ReactNode)[]", description: "Ordered list of keys or Kbd nodes." },
  { name: "separator", type: "ReactNode", default: `"+"`, description: "Visual glue between caps." },
  { name: "platform", type: `"auto" | "mac" | "pc"`, default: `"auto"`, description: "Substitutes ⌘/⌥ or Ctrl/Alt as appropriate." },
];

function KbdDoc() {
  return (
    <DocsShell
      eyebrow="Components · v0.1 · Stable"
      title="Kbd"
      description="Render keyboard shortcuts as physical, semantic key caps. Pair with KbdSequence for platform-aware chords like ⌘K on macOS and Ctrl+K on Windows."
      toc={[
        { id: "example", label: "Example" },
        { id: "installation", label: "Installation" },
        { id: "when", label: "When to use" },
        { id: "playground", label: "Playground" },
        { id: "sizes", label: "Sizes" },
        { id: "sequence", label: "Sequences" },
        { id: "api", label: "API" },
        { id: "a11y", label: "Accessibility" },
        { id: "guidelines", label: "Guidelines" },
        { id: "mistakes", label: "Common mistakes" },
        { id: "related", label: "Related" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>The command palette shortcut, adjusted for macOS.</DocLead>
        <ComponentPreview className="mt-6" code={`<KbdSequence keys={["mod", "K"]} />`}>
          <KbdSequence keys={["mod", "K"]} />
        </ComponentPreview>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <DocParagraph>Install and import.</DocParagraph>
        <div className="mt-5 space-y-3">
          <CodeBlock code={`npx @novix-ui/cli add kbd`} />
          <CodeBlock code={`import { Kbd, KbdSequence } from "@novix-ui/react";`} />
        </div>
      </DocSection>

      <DocSection id="when" title="When to use">
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Use it for</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Menu items with shortcuts</li>
              <li>Command palette rows</li>
              <li>Tooltip hints ("Press K")</li>
              <li>Docs and onboarding tours</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Skip it for</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Inline code — that's what <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">&lt;code&gt;</code> is for.</li>
              <li>Long strings that aren't a single key</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection id="playground" title="Playground">
        <div className="mt-6">
          <Playground
            controls={[
              { kind: "select", key: "size", label: "Size", options: ["xs", "sm", "md", "lg"], defaultValue: "md" },
              { kind: "select", key: "tone", label: "Tone", options: ["default", "subtle", "inverted"], defaultValue: "default" },
              { kind: "switch", key: "pressed", label: "Pressed", defaultValue: false },
            ]}
          >
            {(s) => <Kbd size={s.size as "md"} tone={s.tone as "default"} pressed={Boolean(s.pressed)}>⌘</Kbd>}
          </Playground>
        </div>
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <ComponentPreview
          code={`<Kbd size="xs">⌘</Kbd>
<Kbd size="sm">⌘</Kbd>
<Kbd size="md">⌘</Kbd>
<Kbd size="lg">⌘</Kbd>`}
        >
          <Kbd size="xs">⌘</Kbd>
          <Kbd size="sm">⌘</Kbd>
          <Kbd size="md">⌘</Kbd>
          <Kbd size="lg">⌘</Kbd>
        </ComponentPreview>
      </DocSection>

      <DocSection id="sequence" title="Sequences">
        <p className="text-sm text-muted-foreground">Use <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">mod</code> to write the shortcut once and let the component pick ⌘ or Ctrl per platform.</p>
        <ComponentPreview
          className="mt-4"
          code={`<KbdSequence keys={["mod", "K"]} />
<KbdSequence keys={["shift", "?"]} />
<KbdSequence keys={["mod", "shift", "P"]} />`}
        >
          <KbdSequence keys={["mod", "K"]} />
          <KbdSequence keys={["shift", "?"]} />
          <KbdSequence keys={["mod", "shift", "P"]} />
        </ComponentPreview>
      </DocSection>

      <DocSection id="api" title="API">
        <p className="mb-4 text-sm font-semibold">Kbd</p>
        <PropsTable rows={PROPS} />
        <p className="mb-4 mt-8 text-sm font-semibold">KbdSequence</p>
        <PropsTable rows={SEQUENCE_PROPS} />
      </DocSection>

      <DocSection id="a11y" title="Accessibility">
        <Callout variant="accessibility" title="Kbd caps are decorative">
          Kbd renders inside a <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">&lt;kbd&gt;</code> element and inherits its semantics. Always pair with actual keyboard handling — screen readers announce the label ("Command K"), not the visual glyph.
        </Callout>
      </DocSection>

      <DocSection id="guidelines" title="Design guidelines">
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {[
            { t: "One tone per surface", d: "Menus stay subtle. The command palette uses default. Don't mix." },
            { t: "Order matches typing", d: "Write modifiers left-to-right in the order the user presses them." },
            { t: "Show the shortcut once", d: "Menu item + tooltip is redundant. Pick one." },
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
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Hard-coding "⌘" — Windows users won't see the right glyph. Use <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">"mod"</code>.</span></li>
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Rendering a shortcut with no keyboard handler wired up. The cap is a promise — keep it.</span></li>
        </ul>
      </DocSection>

      <DocSection id="related" title="Related">
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Command palette", href: "/docs/recipes/command-palette", desc: "Full ⌘K experience." },
            { title: "IconButton", href: "/docs/components/icon-button", desc: "Toolbar actions that pair with hotkeys." },
            { title: "Button", href: "/docs/components/button", desc: "Menu triggers with shortcuts." },
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
