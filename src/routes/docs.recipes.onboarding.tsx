import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Badge, Button, Card } from "@/nova";
import { RecipePage } from "@/components/docs/recipe-page";

export const Route = createFileRoute("/docs/recipes/onboarding")({
  component: OnboardingRecipe,
  head: () => ({
    meta: [
      { title: "Onboarding recipe · Novix UI" },
      { name: "description", content: "A multi-step onboarding with progress, skip-safe navigation, and celebratory end." },
    ],
  }),
});

const STEPS = [
  { title: "Create workspace", done: true },
  { title: "Invite your team", done: true },
  { title: "Connect data", done: false },
  { title: "Ship your first flow", done: false },
];

function OnboardingRecipe() {
  return (
    <RecipePage
      eyebrow="Recipes · Flows"
      title="Onboarding flow"
      description="A four-step checklist that celebrates progress. Each step is skippable — but skipping is honest, not hidden."
      preview={
        <Card className="w-full max-w-md p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Get started</p>
            <Badge variant="outline" size="sm">2 of 4</Badge>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-subtle">
            <div className="h-full w-1/2 rounded-full bg-accent" />
          </div>
          <ul className="mt-5 space-y-2">
            {STEPS.map((s) => (
              <li key={s.title} className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${s.done ? "border-border/40 text-muted-foreground line-through" : "border-border/70"}`}>
                <span className={`flex size-6 items-center justify-center rounded-full ${s.done ? "bg-success/15 text-success" : "border border-border"}`}>{s.done ? <Check className="size-3.5" /> : null}</span>
                {s.title}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between">
            <Button variant="ghost" size="sm">Skip for now</Button>
            <Button size="sm">Continue</Button>
          </div>
        </Card>
      }
      source={`export function OnboardingCard({ steps, progress }) {
  return (
    <Card className="max-w-md p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Get started</h3>
        <Badge variant="outline" size="sm">{progress.done} of {progress.total}</Badge>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-subtle overflow-hidden">
        <div className="h-full bg-accent" style={{ width: \`\${(progress.done / progress.total) * 100}%\` }} />
      </div>
      <ul className="mt-5 space-y-2">
        {steps.map((s) => (
          <StepRow key={s.id} step={s} />
        ))}
      </ul>
    </Card>
  );
}`}
      anatomy={[
        "Progress bar always visible so users know how much is left.",
        "Completed steps stay in the list (crossed out) — visible progress is motivating.",
        "'Skip for now' as a ghost button, not hidden in a menu.",
        "Celebrate the final step with a confetti burst or a state-change badge.",
      ]}
      related={[
        { title: "Card component", href: "/docs/components/card" },
        { title: "Empty states", href: "/docs/recipes/empty-states" },
      ]}
    />
  );
}
