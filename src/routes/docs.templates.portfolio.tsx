import { createFileRoute } from "@tanstack/react-router";
import { Avatar, Badge, Card } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/portfolio")({
  component: PortfolioTemplate,
  head: () => ({ meta: [{ title: "Portfolio template · Novix UI" }, { name: "description", content: "A personal portfolio with case studies and pinned work." }] }),
});

function PortfolioTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Personal"
      title="Portfolio"
      description="A single-page portfolio with a hero, pinned case studies, and a bio footer."
      install={`npx @novix-ui/cli template add portfolio`}
      includes={["Hero + intro", "Case study grid", "Skills row", "Contact CTA"]}
      preview={
        <div className="w-full">
          <div className="flex items-center gap-3">
            <Avatar size="lg" name="Ada Lovelace" />
            <div>
              <p className="text-sm font-semibold">Ada Lovelace</p>
              <p className="text-xs text-muted-foreground">Design engineer · London</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Novix UI", "Analytical Engine", "Bernoulli Notes"].map((p) => (
              <Card key={p} className="p-3">
                <p className="text-sm font-semibold">{p}</p>
                <p className="mt-1 text-xs text-muted-foreground">Short one-line description of the case study.</p>
                <Badge variant="outline" size="sm" className="mt-3">2026</Badge>
              </Card>
            ))}
          </div>
        </div>
      }
      source={`// src/routes/index.tsx
export function Portfolio() {
  return (
    <>
      <Hero />
      <PinnedWork projects={projects} />
      <ContactFooter />
    </>
  );
}`}
    />
  );
}
