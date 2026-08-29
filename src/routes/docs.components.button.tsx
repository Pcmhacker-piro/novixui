import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Search, Sparkles, Trash2 } from "lucide-react";
import { Badge, Button } from "@/nova";
import { DocsShell, DocSection, DocLead, DocParagraph } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropRow } from "@/components/docs/props-table";
import { Playground } from "@/components/docs/playground";

export const Route = createFileRoute("/docs/components/button")({
  component: ButtonDocPage,
  head: () => ({
    meta: [
      { title: "Button · Novix UI" },
      {
        name: "description",
        content:
          "The Nova Button — polymorphic, 7 variants, loading state, leading and trailing icons, and physical press feedback.",
      },
      { property: "og:title", content: "Button · Novix UI" },
      {
        property: "og:description",
        content:
          "Sculpted, accessible React button primitive with cursor-aware lighting and physical press feedback.",
      },
    ],
  }),
});

const PROPS: PropRow[] = [
  {
    name: "variant",
    type: `"primary" | "accent" | "secondary" | "outline" | "ghost" | "destructive" | "link"`,
    default: `"primary"`,
    description: "Visual intent. Filled variants ship with the Nova gloss sheen.",
  },
  {
    name: "size",
    type: `"sm" | "md" | "lg" | "icon"`,
    default: `"md"`,
    description: "Height and horizontal padding. Use size='icon' for square icon-only buttons.",
  },
  {
    name: "asChild",
    type: "boolean",
    default: "false",
    description:
      "Merge props onto the child element instead of rendering a <button>. Use with <Link>, <a>, etc.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Replaces the leading icon with a spinner and marks the button aria-busy.",
  },
  {
    name: "leadingIcon",
    type: "ReactNode",
    description: "Icon rendered before the label. Automatically sized to match the text.",
  },
  {
    name: "trailingIcon",
    type: "ReactNode",
    description: "Icon rendered after the label. Ideal for arrows, external-link glyphs.",
  },
];

const KEYS: { keys: string; label: string }[] = [
  { keys: "Tab", label: "Move focus to the button." },
  { keys: "Enter / Space", label: "Activate the button." },
  { keys: "Shift + Tab", label: "Move focus to the previous focusable element." },
];

export default function ButtonDocPage() {
  return (
    <DocsShell
      eyebrow="Components · v0.1 · Stable"
      title="Button"
      description="Nova's most-used control. Polymorphic, accessible, and tuned for physical feedback — a soft downward compress on press and a diagonal sheen on hover."
      toc={[
        { id: "example", label: "Example" },
        { id: "installation", label: "Installation" },
        { id: "playground", label: "Playground" },
        { id: "variants", label: "Variants" },
        { id: "sizes", label: "Sizes" },
        { id: "state", label: "Loading & icons" },
        { id: "aschild", label: "As child" },
        { id: "api", label: "API" },
        { id: "keyboard", label: "Keyboard" },
        { id: "a11y", label: "Accessibility" },
        { id: "guidelines", label: "Guidelines" },
        { id: "mistakes", label: "Common mistakes" },
        { id: "related", label: "Related" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>The primary call to action. Filled variants carry the signature gloss.</DocLead>
        <ComponentPreview
          className="mt-6"
          code={`import { Button } from "@novix-ui/react";
import { ArrowRight } from "lucide-react";

export default function Example() {
  return <Button trailingIcon={<ArrowRight />}>Get started</Button>;
}`}
        >
          <Button trailingIcon={<ArrowRight />}>Get started</Button>
        </ComponentPreview>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <DocParagraph>Install via the Nova CLI, or copy the component into your project.</DocParagraph>
        <div className="mt-5 space-y-3">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              CLI
            </p>
            <CodeBlock code={`npx @novix-ui/cli add button`} />
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Import
            </p>
            <CodeBlock code={`import { Button } from "@novix-ui/react";`} />
          </div>
        </div>
      </DocSection>

      <DocSection id="playground" title="Playground">
        <DocParagraph>Change any prop. The preview updates instantly.</DocParagraph>
        <div className="mt-6">
          <Playground
            controls={[
              {
                kind: "select",
                key: "variant",
                label: "Variant",
                options: ["primary", "accent", "secondary", "outline", "ghost", "destructive"],
                defaultValue: "primary",
              },
              {
                kind: "select",
                key: "size",
                label: "Size",
                options: ["sm", "md", "lg"],
                defaultValue: "md",
              },
              { kind: "switch", key: "loading", label: "Loading", defaultValue: false },
              { kind: "switch", key: "disabled", label: "Disabled", defaultValue: false },
              { kind: "switch", key: "leading", label: "Leading icon", defaultValue: false },
              { kind: "switch", key: "trailing", label: "Trailing icon", defaultValue: true },
            ]}
          >
            {(s) => (
              <Button
                variant={s.variant as "primary"}
                size={s.size as "md"}
                loading={Boolean(s.loading)}
                disabled={Boolean(s.disabled)}
                leadingIcon={s.leading ? <Sparkles /> : undefined}
                trailingIcon={s.trailing ? <ArrowRight /> : undefined}
              >
                Continue
              </Button>
            )}
          </Playground>
        </div>
      </DocSection>

      <DocSection id="variants" title="Variants">
        <p className="leading-relaxed text-muted-foreground">
          Seven variants cover the intent spectrum. Reserve{" "}
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">accent</code>{" "}
          for a single hero action per view.
        </p>
        <ComponentPreview
          className="mt-6"
          code={`<Button>Primary</Button>
<Button variant="accent">Accent</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Learn more</Button>`}
        >
          <Button>Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="link">Learn more</Button>
        </ComponentPreview>
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <ComponentPreview
          code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Search"><Search /></Button>`}
        >
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Search">
            <Search />
          </Button>
        </ComponentPreview>
      </DocSection>

      <DocSection id="state" title="Loading and icons">
        <ComponentPreview
          replayable
          code={`<Button loading>Saving</Button>
<Button leadingIcon={<Sparkles />}>Generate</Button>
<Button variant="secondary" trailingIcon={<ArrowRight />}>Continue</Button>
<Button variant="destructive" leadingIcon={<Trash2 />}>Delete workspace</Button>`}
        >
          <Button loading>Saving</Button>
          <Button leadingIcon={<Sparkles />}>Generate</Button>
          <Button variant="secondary" trailingIcon={<ArrowRight />}>
            Continue
          </Button>
          <Button variant="destructive" leadingIcon={<Trash2 />}>
            Delete workspace
          </Button>
        </ComponentPreview>
      </DocSection>

      <DocSection id="aschild" title="As child">
        <p className="leading-relaxed text-muted-foreground">
          Set <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">asChild</code>{" "}
          to render the button styles onto a child element — commonly a router
          link. All button props, states, and events flow through.
        </p>
        <CodeBlock
          className="mt-5"
          code={`import { Link } from "@tanstack/react-router";
import { Button } from "@novix-ui/react";

<Button asChild>
  <Link to="/pricing">See pricing</Link>
</Button>`}
        />
      </DocSection>

      <DocSection id="api" title="API">
        <PropsTable rows={PROPS} />
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <div className="mt-4 overflow-hidden rounded-xl border border-border/70">
          <table className="w-full text-sm">
            <thead className="bg-subtle/60">
              <tr>
                <th className="px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Key
                </th>
                <th className="px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {KEYS.map((row, i) => (
                <tr key={row.keys} className={i > 0 ? "border-t border-border/60" : ""}>
                  <td className="px-4 py-3 font-mono text-[12.5px] text-foreground">{row.keys}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="a11y" title="Accessibility">
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li>
            Rendered as a native{" "}
            <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">&lt;button&gt;</code>{" "}
            unless{" "}
            <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">asChild</code>{" "}
            is set.
          </li>
          <li>
            Icon-only buttons must receive{" "}
            <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">aria-label</code>.
            Prefer{" "}
            <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">IconButton</code>{" "}
            which enforces it at the type level.
          </li>
          <li>
            Loading state applies{" "}
            <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">aria-busy</code>{" "}
            and blocks pointer events without collapsing size.
          </li>
          <li>Focus ring uses two layers so it stays visible on any background.</li>
        </ul>
      </DocSection>

      <DocSection id="guidelines" title="Design guidelines">
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {[
            { t: "One hero per view", d: "Reserve the accent variant for the primary action of a screen. Multiple accents cancel each other out." },
            { t: "Label with a verb", d: "\"Save changes\" beats \"OK\". Buttons commit to an outcome — say what happens next." },
            { t: "Size matches surface", d: "sm for dense toolbars, md for forms, lg for landing heroes. Don't mix in the same row." },
            { t: "Destructive gets confirmation", d: "Pair destructive with a dialog or undo. Never a single-click delete." },
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
          <li className="flex gap-3">
            <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-danger" />
            <span className="text-muted-foreground">
              Wrapping a <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">Link</code>{" "}
              in a Button instead of using{" "}
              <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">asChild</code> —
              produces invalid nested interactives.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-danger" />
            <span className="text-muted-foreground">
              Using{" "}
              <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">size="icon"</code>{" "}
              without an <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">aria-label</code>.
              Screen readers will announce "button" with no name.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-danger" />
            <span className="text-muted-foreground">
              Disabling a button during async work instead of using{" "}
              <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">loading</code>.
              Disabled buttons drop out of the tab order and hide progress.
            </span>
          </li>
        </ul>
      </DocSection>

      <DocSection id="related" title="Related">
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {[
            { title: "IconButton", href: "/docs/components/icon-button", desc: "Icon-only actions with enforced aria-label." },
            { title: "Kbd", href: "/docs/components/kbd", desc: "Render keyboard shortcuts on trigger buttons." },
            { title: "Spinner", href: "/docs/components/spinner", desc: "Standalone activity indicator." },
          ].map((r) => (
            <a
              key={r.href}
              href={r.href}
              className="nova-card-surface group block rounded-xl p-4 transition hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{r.title}</p>
                <Badge variant="outline" size="sm">
                  soon
                </Badge>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{r.desc}</p>
            </a>
          ))}
        </div>
      </DocSection>
    </DocsShell>
  );
}
