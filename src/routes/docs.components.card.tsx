import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Badge, Button, Card, CardDescription, CardHeader, CardTitle, Separator } from "@/nova";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { PropsTable, type PropRow } from "@/components/docs/props-table";

export const Route = createFileRoute("/docs/components/card")({
  component: CardDocPage,
  head: () => ({
    meta: [
      { title: "Card · Novix UI" },
      {
        name: "description",
        content:
          "Nova's signature surface. Layered ambient + key shadows, moon-edge highlight, and an optional cursor-tracking halo.",
      },
    ],
  }),
});

const PROPS: PropRow[] = [
  {
    name: "variant",
    type: `"default" | "elevated" | "ghost" | "outline"`,
    default: `"default"`,
    description: "Resting elevation and border treatment.",
  },
  {
    name: "padding",
    type: `"none" | "sm" | "md" | "lg"`,
    default: `"md"`,
    description: "Uniform inner padding. Use 'none' to render your own layout inside.",
  },
  {
    name: "interactive",
    type: "boolean",
    default: "false",
    description:
      "Enables the cursor-tracking halo, hover lift, and press sink. Also sets a focus ring — pair with tabIndex={0} for keyboard focus.",
  },
];

function CardDocPage() {
  return (
    <DocsShell
      eyebrow="Components · v0.1"
      title="Card"
      description="The Nova signature surface. Every stable component sits on top of a Card at some level — every gradient, halo, and moon-edge trick you see across Nova lives here."
      toc={[
        { id: "example", label: "Example" },
        { id: "anatomy", label: "Anatomy" },
        { id: "variants", label: "Variants" },
        { id: "interactive", label: "Interactive" },
        { id: "api", label: "API" },
      ]}
    >
      <DocSection id="example" title="Example">
        <DocLead>Hover the card. The halo tracks your cursor across the surface.</DocLead>
        <ComponentPreview
          className="mt-6"
          code={`<Card interactive tabIndex={0} padding="md">
  <CardHeader>
    <CardTitle>Monthly plan</CardTitle>
    <CardDescription>Move your cursor across the card.</CardDescription>
  </CardHeader>
  <div className="mt-3 flex items-baseline gap-1">
    <span className="text-2xl font-semibold">$24</span>
    <span className="text-xs text-muted-foreground">/ month</span>
  </div>
</Card>`}
        >
          <Card interactive tabIndex={0} padding="md" className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Monthly plan</CardTitle>
              <CardDescription>Move your cursor across the card.</CardDescription>
            </CardHeader>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-semibold">$24</span>
              <span className="text-xs text-muted-foreground">/ month</span>
            </div>
          </Card>
        </ComponentPreview>
      </DocSection>

      <DocSection id="anatomy" title="Anatomy">
        <p className="leading-relaxed text-muted-foreground">
          Cards ship with a set of composable subcomponents. Use them to keep
          typography rhythm consistent across surfaces.
        </p>
        <ComponentPreview
          className="mt-6"
          code={`<Card>
  <CardHeader>
    <CardTitle>Workspace</CardTitle>
    <CardDescription>Manage members, invites, and roles.</CardDescription>
  </CardHeader>
  <Separator className="my-4" />
  <p className="text-sm text-muted-foreground">12 seats · 3 pending invites</p>
</Card>`}
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>Manage members, invites, and roles.</CardDescription>
            </CardHeader>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">12 seats · 3 pending invites</p>
          </Card>
        </ComponentPreview>
      </DocSection>

      <DocSection id="variants" title="Variants">
        <ComponentPreview
          align="start"
          code={`<Card variant="default" padding="sm">default</Card>
<Card variant="elevated" padding="sm">elevated</Card>
<Card variant="outline" padding="sm">outline</Card>
<Card variant="ghost" padding="sm">ghost</Card>`}
        >
          <Card variant="default" padding="sm" className="w-40 text-sm">
            default
          </Card>
          <Card variant="elevated" padding="sm" className="w-40 text-sm">
            elevated
          </Card>
          <Card variant="outline" padding="sm" className="w-40 text-sm">
            outline
          </Card>
          <Card variant="ghost" padding="sm" className="w-40 text-sm">
            ghost
          </Card>
        </ComponentPreview>
      </DocSection>

      <DocSection id="interactive" title="Interactive">
        <p className="leading-relaxed text-muted-foreground">
          Enable <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">interactive</code>{" "}
          for surfaces that should feel clickable. It adds a cursor-tracking halo,
          a hover lift, and press physics. Pair with{" "}
          <code className="rounded bg-subtle px-1 py-0.5 font-mono text-[12.5px]">tabIndex={"{0}"}</code>{" "}
          or wrap in an anchor for keyboard access.
        </p>
        <ComponentPreview
          className="mt-6"
          code={`<Card interactive tabIndex={0}>
  <CardHeader>
    <CardTitle>Upgrade to Pro</CardTitle>
    <CardDescription>Unlimited workspaces and priority support.</CardDescription>
  </CardHeader>
  <Button className="mt-4" size="sm" trailingIcon={<ArrowRight />}>
    Upgrade
  </Button>
</Card>`}
        >
          <Card interactive tabIndex={0} className="w-full max-w-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upgrade to Pro</CardTitle>
                <Badge variant="accent" size="sm">
                  Recommended
                </Badge>
              </div>
              <CardDescription>Unlimited workspaces and priority support.</CardDescription>
            </CardHeader>
            <Button className="mt-4" size="sm" trailingIcon={<ArrowRight />}>
              Upgrade
            </Button>
          </Card>
        </ComponentPreview>
      </DocSection>

      <DocSection id="api" title="API">
        <PropsTable rows={PROPS} />
      </DocSection>
    </DocsShell>
  );
}
