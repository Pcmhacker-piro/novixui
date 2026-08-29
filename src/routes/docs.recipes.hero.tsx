import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge, Button } from "@/nova";
import { RecipePage } from "@/components/docs/recipe-page";

export const Route = createFileRoute("/docs/recipes/hero")({
  component: HeroRecipe,
  head: () => ({
    meta: [
      { title: "Marketing hero recipe · Novix UI" },
      { name: "description", content: "A centered marketing hero with eyebrow badge, headline, sub-copy, and dual CTAs." },
    ],
  }),
});

function HeroRecipe() {
  return (
    <RecipePage
      eyebrow="Recipes · Marketing"
      title="Marketing hero"
      description="The canonical landing hero. Eyebrow, headline, one-sentence sub, and two CTAs — one accent, one ghost."
      preview={
        <div className="w-full py-10 text-center">
          <Badge variant="outline" size="sm" className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3" /> v0.1 · Foundations
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">A design system that ships.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">Novix UI is a premium React library for SaaS, AI, and dashboards. Copy the source. Own the code.</p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button variant="accent" trailingIcon={<ArrowRight className="size-4" />}>Get started</Button>
            <Button variant="ghost">Star on GitHub</Button>
          </div>
        </div>
      }
      source={`import { Badge, Button } from "@novix-ui/react";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="py-24 text-center">
      <Badge variant="outline" size="sm" className="inline-flex items-center gap-1.5">
        <Sparkles className="size-3" /> v0.1 · Foundations
      </Badge>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
        A design system that ships.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Novix UI is a premium React library for SaaS, AI, and dashboards.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Button variant="accent" trailingIcon={<ArrowRight className="size-4" />}>
          Get started
        </Button>
        <Button variant="ghost">Star on GitHub</Button>
      </div>
    </section>
  );
}`}
      anatomy={[
        "Eyebrow Badge — sets context in one glance.",
        "One-sentence headline — no line breaks, no bold.",
        "Sub-copy at 15–17px, capped at 60ch.",
        "Two CTAs — accent (primary intent) and ghost (secondary path).",
      ]}
      tip={{ title: "Never three CTAs", body: "A third button dilutes the first two. If a third option exists, put it in the sub-copy as a link." }}
      related={[
        { title: "Landing page template", href: "/docs/templates/landing-page" },
        { title: "Button component", href: "/docs/components/button" },
      ]}
    />
  );
}
