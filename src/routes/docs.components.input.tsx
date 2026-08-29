import { createFileRoute } from "@tanstack/react-router";
import { Mail, Search } from "lucide-react";
import { Input } from "@/nova";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { PropsTable, type PropRow } from "@/components/docs/props-table";

export const Route = createFileRoute("/docs/components/input")({
  component: InputDocPage,
  head: () => ({
    meta: [
      { title: "Input · Novix UI" },
      {
        name: "description",
        content:
          "Accessible text input with labels, hints, errors, and icon affixes. Semantic <label> always on.",
      },
    ],
  }),
});

const PROPS: PropRow[] = [
  { name: "label", type: "string", description: "Visible semantic label. Auto-associates with the input." },
  { name: "hint", type: "string", description: "Helper text shown below the input." },
  { name: "error", type: "string", description: "Error message. Applies invalid styling and aria-invalid." },
  { name: "leadingIcon", type: "ReactNode", description: "Icon rendered inside the left padding." },
  { name: "trailingIcon", type: "ReactNode", description: "Icon rendered inside the right padding." },
  {
    name: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Height and typography scale.",
  },
];

function InputDocPage() {
  return (
    <DocsShell
      eyebrow="Components · v0.1"
      title="Input"
      description="A polished, accessible text input. Labels are always semantic, errors are announced to assistive tech, and icon affixes keep the type baseline stable."
      toc={[
        { id: "example", label: "Example" },
        { id: "labels", label: "Labels & hints" },
        { id: "affixes", label: "Icon affixes" },
        { id: "errors", label: "Errors" },
        { id: "api", label: "API" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>The simplest possible use.</DocLead>
        <ComponentPreview
          align="start"
          className="mt-6"
          code={`<Input label="Email" type="email" placeholder="you@company.com" />`}
        >
          <div className="w-full max-w-sm">
            <Input label="Email" type="email" placeholder="you@company.com" />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="labels" title="Labels and hints">
        <ComponentPreview
          align="start"
          code={`<Input
  label="Workspace"
  placeholder="acme"
  hint="Only lowercase letters, numbers, and dashes."
/>`}
        >
          <div className="w-full max-w-sm">
            <Input
              label="Workspace"
              placeholder="acme"
              hint="Only lowercase letters, numbers, and dashes."
            />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="affixes" title="Icon affixes">
        <ComponentPreview
          align="start"
          code={`<Input
  label="Email"
  type="email"
  leadingIcon={<Mail />}
  placeholder="you@company.com"
/>
<Input placeholder="Search…" leadingIcon={<Search />} />`}
        >
          <div className="w-full max-w-sm space-y-3">
            <Input
              label="Email"
              type="email"
              leadingIcon={<Mail />}
              placeholder="you@company.com"
            />
            <Input placeholder="Search…" leadingIcon={<Search />} />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="errors" title="Errors">
        <p className="leading-relaxed text-muted-foreground">
          Setting <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">error</code>{" "}
          applies invalid styling, wires up{" "}
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">aria-invalid</code>,
          and announces the message via{" "}
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">aria-describedby</code>.
        </p>
        <ComponentPreview
          align="start"
          className="mt-6"
          code={`<Input
  label="Handle"
  defaultValue="nova"
  error="This handle is already taken."
/>`}
        >
          <div className="w-full max-w-sm">
            <Input label="Handle" defaultValue="nova" error="This handle is already taken." />
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="api" title="API">
        <PropsTable rows={PROPS} />
      </DocSection>
    </DocsShell>
  );
}
