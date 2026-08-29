import { createFileRoute } from "@tanstack/react-router";
import { Badge, Input, Label } from "@/nova";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropRow } from "@/components/docs/props-table";
import { Playground } from "@/components/docs/playground";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/components/label")({
  component: LabelDoc,
  head: () => ({
    meta: [
      { title: "Label · Novix UI" },
      { name: "description", content: "Accessible form label with required and optional indicators." },
      { property: "og:title", content: "Label · Novix UI" },
      { property: "og:description", content: "Accessible form label with required/optional indicators." },
    ],
  }),
});

const PROPS: PropRow[] = [
  { name: "htmlFor", type: "string", description: "Associates the label with a control by id." },
  { name: "size", type: `"sm" | "md" | "lg"`, default: `"md"`, description: "Text size." },
  { name: "tone", type: `"default" | "muted" | "invalid"`, default: `"default"`, description: "Color intent, e.g. red for validation." },
  { name: "required", type: "boolean", description: "Renders a red asterisk with sr-only 'required'." },
  { name: "optional", type: "boolean", description: "Renders a subtle '(optional)' hint." },
];

function LabelDoc() {
  return (
    <DocsShell
      eyebrow="Components · v0.1 · Stable"
      title="Label"
      description="The text tag for form controls. Uses Radix Label so click and screen-reader semantics are correct, with typography tuned for high-density forms."
      toc={[
        { id: "example", label: "Example" },
        { id: "installation", label: "Installation" },
        { id: "when", label: "When to use" },
        { id: "playground", label: "Playground" },
        { id: "indicators", label: "Required & optional" },
        { id: "tones", label: "Tones" },
        { id: "api", label: "API" },
        { id: "a11y", label: "Accessibility" },
        { id: "guidelines", label: "Guidelines" },
        { id: "mistakes", label: "Common mistakes" },
        { id: "related", label: "Related" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>A label wired to an input via <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">htmlFor</code>.</DocLead>
        <ComponentPreview
          className="mt-6"
          align="start"
          code={`<div className="w-72 space-y-2">
  <Label htmlFor="email" required>Email</Label>
  <Input id="email" type="email" placeholder="ada@novix.dev" />
</div>`}
        >
          <div className="w-72 space-y-2">
            <Label htmlFor="email" required>Email</Label>
            <Input id="email" type="email" placeholder="ada@novix.dev" />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <DocParagraph>Install and import.</DocParagraph>
        <div className="mt-5 space-y-3">
          <CodeBlock code={`npx @novix-ui/cli add label`} />
          <CodeBlock code={`import { Label } from "@novix-ui/react";`} />
        </div>
      </DocSection>

      <DocSection id="when" title="When to use">
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Use it for</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>Every visible form input, always</li>
              <li>Checkbox and radio row labels</li>
              <li>Setting rows with a name and description</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 p-4">
            <p className="text-sm font-semibold">Skip it when</p>
            <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
              <li>The control has a visible label already (e.g. Button copy)</li>
              <li>Hidden labels are acceptable — use <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">sr-only</code></li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection id="playground" title="Playground">
        <div className="mt-6">
          <Playground
            controls={[
              { kind: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], defaultValue: "md" },
              { kind: "select", key: "tone", label: "Tone", options: ["default", "muted", "invalid"], defaultValue: "default" },
              { kind: "switch", key: "required", label: "Required", defaultValue: false },
              { kind: "switch", key: "optional", label: "Optional", defaultValue: false },
            ]}
          >
            {(s) => (
              <Label
                size={s.size as "md"}
                tone={s.tone as "default"}
                required={Boolean(s.required)}
                optional={Boolean(s.optional)}
              >
                Workspace name
              </Label>
            )}
          </Playground>
        </div>
      </DocSection>

      <DocSection id="indicators" title="Required & optional">
        <ComponentPreview
          align="start"
          code={`<Label required>Email</Label>
<Label optional>Company</Label>`}
        >
          <div className="flex flex-col gap-3">
            <Label required>Email</Label>
            <Label optional>Company</Label>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="tones" title="Tones">
        <ComponentPreview
          align="start"
          code={`<Label>Default</Label>
<Label tone="muted">Muted</Label>
<Label tone="invalid">Invalid</Label>`}
        >
          <div className="flex flex-col gap-3">
            <Label>Default</Label>
            <Label tone="muted">Muted</Label>
            <Label tone="invalid">Invalid</Label>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="api" title="API">
        <PropsTable rows={PROPS} />
      </DocSection>

      <DocSection id="a11y" title="Accessibility">
        <Callout variant="accessibility" title="Every input needs a Label">
          Placeholders are not labels — they disappear on focus and vanish for screen readers when empty. Even visually hidden labels are better.
        </Callout>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>Uses Radix Label so clicking anywhere focuses the associated control.</li>
          <li>The required asterisk includes a visually hidden "required" for screen readers.</li>
          <li>Set <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">tone="invalid"</code> alongside <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">aria-invalid</code> on the input.</li>
        </ul>
      </DocSection>

      <DocSection id="guidelines" title="Design guidelines">
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {[
            { t: "One indicator, not both", d: "A form is 'mostly required, optional marked' or 'mostly optional, required marked'. Pick one to reduce noise." },
            { t: "Nouns, not sentences", d: "'Email' beats 'What's your email address?'. Save context for the hint text." },
            { t: "Sentence case", d: "'Workspace name', not 'Workspace Name'. Titles feel bureaucratic in forms." },
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
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Missing <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">htmlFor</code>. The click-to-focus behavior only works with a matching id.</span></li>
          <li className="flex gap-3"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-danger" /><span className="text-muted-foreground">Using placeholder text as a label. Every user with reduced vision or a screen reader loses the field's meaning.</span></li>
        </ul>
      </DocSection>

      <DocSection id="related" title="Related">
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Input", href: "/docs/components/input", desc: "The most common Label target." },
            { title: "Forms recipe", href: "/docs/recipes/forms", desc: "Full form composition with validation." },
            { title: "Accessibility guide", href: "/docs/accessibility", desc: "Labeling patterns end-to-end." },
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
