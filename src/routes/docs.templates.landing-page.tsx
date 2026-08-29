import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge, Button, Card } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/landing-page")({
  component: LandingTemplate,
  head: () => ({ meta: [{ title: "Landing page template · Novix UI" }, { name: "description", content: "Marketing landing template — hero, features, social proof, CTA." }] }),
});

function LandingTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Marketing"
      title="Landing page"
      description="A single-page marketing site — hero, feature grid, quotes, and a final CTA."
      install={`npx @novix-ui/cli template add landing-page`}
      includes={["Hero", "Feature grid", "Testimonials", "CTA footer", "SEO metadata"]}
      preview={
        <div className="w-full space-y-6 text-center">
          <div className="py-6">
            <Badge variant="outline" size="sm" className="inline-flex items-center gap-1.5"><Sparkles className="size-3" />New in Nova</Badge>
            <p className="mt-3 text-2xl font-semibold tracking-tight">Ship the interface you always wanted.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Novix UI is a premium component library for teams that care about craft.</p>
            <div className="mt-4 flex justify-center gap-2">
              <Button variant="accent" trailingIcon={<ArrowRight className="size-4" />}>Get started</Button>
              <Button variant="ghost">Docs</Button>
            </div>
          </div>
          <div className="grid gap-3 text-left sm:grid-cols-3">
            {["Sculpted depth", "Motion by design", "AI native"].map((t) => (
              <Card key={t} className="p-4">
                <p className="text-sm font-semibold">{t}</p>
                <p className="mt-1 text-xs text-muted-foreground">A one-line pitch about what makes this pillar different.</p>
              </Card>
            ))}
          </div>
        </div>
      }
      source={`// src/routes/index.tsx
import { Badge, Button, Card } from "@novix-ui/react";

export function Landing() {
  return (
    <main>
      <Hero />
      <FeatureGrid />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}`}
    />
  );
}
