import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/nova";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { PropsTable, type PropRow } from "@/components/docs/props-table";

export const Route = createFileRoute("/docs/components/badge")({
  component: BadgeDocPage,
  head: () => ({
    meta: [
      { title: "Badge · Novix UI" },
      {
        name: "description",
        content:
          "Compact status pills for tags, states, and metadata. Seven tones, three sizes, optional status dot.",
      },
    ],
  }),
});

const PROPS: PropRow[] = [
  {
    name: "variant",
    type: `"neutral" | "primary" | "accent" | "outline" | "success" | "warning" | "danger"`,
    default: `"neutral"`,
    description: "Semantic tone. Reserve success/warning/danger for status meaning.",
  },
  {
    name: "size",
    type: `"sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Height and horizontal padding.",
  },
  {
    name: "dot",
    type: "boolean",
    default: "false",
    description: "Show a leading status dot. Auto-colors to the badge variant.",
  },
];

function BadgeDocPage() {
  return (
    <DocsShell
      eyebrow="Components · v0.1"
      title="Badge"
      description="Small, semantic status pills. Use them to tag records, indicate state, and communicate meta without stealing focus from the content."
      toc={[
        { id: "example", label: "Example" },
        { id: "variants", label: "Variants" },
        { id: "sizes", label: "Sizes" },
        { id: "dot", label: "Status dot" },
        { id: "api", label: "API" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>A quiet way to communicate status and metadata.</DocLead>
        <ComponentPreview
          className="mt-6"
          code={`<Badge variant="success" dot>Live</Badge>`}
        >
          <Badge variant="success" dot>
            Live
          </Badge>
        </ComponentPreview>
      </DocSection>

      <DocSection id="variants" title="Variants">
        <ComponentPreview
          code={`<Badge>Neutral</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="accent">Accent</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>`}
        >
          <Badge>Neutral</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </ComponentPreview>
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <ComponentPreview
          code={`<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg" variant="accent">Large</Badge>`}
        >
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg" variant="accent">
            Large
          </Badge>
        </ComponentPreview>
      </DocSection>

      <DocSection id="dot" title="Status dot">
        <ComponentPreview
          code={`<Badge variant="success" dot>Online</Badge>
<Badge variant="warning" dot>Degraded</Badge>
<Badge variant="danger" dot>Down</Badge>`}
        >
          <Badge variant="success" dot>
            Online
          </Badge>
          <Badge variant="warning" dot>
            Degraded
          </Badge>
          <Badge variant="danger" dot>
            Down
          </Badge>
        </ComponentPreview>
      </DocSection>

      <DocSection id="api" title="API">
        <PropsTable rows={PROPS} />
      </DocSection>
    </DocsShell>
  );
}
