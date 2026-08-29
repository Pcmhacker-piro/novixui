import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Badge, Button, Card } from "@/nova";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/recipes/pricing")({
  component: PricingRecipe,
  head: () => ({
    meta: [
      { title: "Pricing recipe · Novix UI" },
      { name: "description", content: "A three-tier pricing grid with a highlighted plan built from Nova primitives." },
      { property: "og:title", content: "Pricing · Novix UI" },
      { property: "og:description", content: "Three-tier pricing grid." },
    ],
  }),
});

const TIERS = [
  { name: "Starter", price: "$0", tag: "For prototypes", features: ["100 requests / mo", "Community support", "Public projects"], cta: "Start free", featured: false },
  { name: "Team", price: "$29", tag: "For growing teams", features: ["10k requests / mo", "Email support", "Private projects", "Role-based access"], cta: "Start trial", featured: true },
  { name: "Enterprise", price: "Custom", tag: "For scale", features: ["Unlimited requests", "SLA + dedicated CSM", "SSO / SAML", "Audit logs"], cta: "Talk to sales", featured: false },
];

function PricingRecipe() {
  return (
    <DocsShell
      eyebrow="Recipes · Marketing"
      title="Pricing page"
      description="Three tiers, one featured, with a compact feature list. Uses Card, Badge, and Button — no bespoke CSS."
      toc={[
        { id: "preview", label: "Preview" },
        { id: "source", label: "Source" },
        { id: "guidelines", label: "Guidelines" },
      ]}
    >
      <DocSection id="preview" title="Preview">
        <DocLead>Elevate the recommended plan with an accent badge and a subtle scale change on hover.</DocLead>
        <ComponentPreview className="mt-6" align="start" code={SOURCE}>
          <div className="grid w-full gap-4 sm:grid-cols-3">
            {TIERS.map((t) => (
              <Card key={t.name} className={t.featured ? "p-5 ring-2 ring-accent" : "p-5"}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{t.name}</p>
                  {t.featured ? <Badge variant="accent" size="sm">Popular</Badge> : null}
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight">{t.price}<span className="text-sm text-muted-foreground">{t.price === "Custom" ? "" : " / mo"}</span></p>
                <p className="text-xs text-muted-foreground">{t.tag}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-accent" />{f}</li>
                  ))}
                </ul>
                <Button variant={t.featured ? "accent" : "secondary"} className="mt-5 w-full">{t.cta}</Button>
              </Card>
            ))}
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="source" title="Source">
        <CodeBlock code={SOURCE} />
      </DocSection>

      <DocSection id="guidelines" title="Guidelines">
        <Callout variant="best-practice" title="One tier gets the emphasis">
          Two highlighted tiers cancel each other out. Pick the plan that fits most customers and let the visual system tell the story.
        </Callout>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>Prefer per-month pricing anchored to annual value ("billed yearly, $348").</li>
          <li>Feature lists cap at 5 rows per tier. Deeper differences belong in a matrix below.</li>
          <li>Enterprise CTAs go to a form, not a checkout.</li>
        </ul>
      </DocSection>
    </DocsShell>
  );
}

const SOURCE = `import { Badge, Button, Card } from "@novix-ui/react";
import { Check } from "lucide-react";

const TIERS = [
  { name: "Starter", price: "$0", featured: false, features: [...] },
  { name: "Team", price: "$29", featured: true, features: [...] },
  { name: "Enterprise", price: "Custom", featured: false, features: [...] },
];

export function Pricing() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TIERS.map((t) => (
        <Card key={t.name} className={t.featured ? "p-5 ring-2 ring-accent" : "p-5"}>
          <div className="flex items-center justify-between">
            <p className="font-semibold">{t.name}</p>
            {t.featured && <Badge variant="accent" size="sm">Popular</Badge>}
          </div>
          <p className="mt-3 text-2xl font-semibold">{t.price}</p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            {t.features.map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="mt-0.5 size-4 text-accent" />{f}
              </li>
            ))}
          </ul>
          <Button variant={t.featured ? "accent" : "secondary"} className="mt-5 w-full">
            {t.featured ? "Start trial" : "Choose"}
          </Button>
        </Card>
      ))}
    </div>
  );
}`;
