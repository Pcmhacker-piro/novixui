import { createFileRoute } from "@tanstack/react-router";
import { Button, Input, Label } from "@/nova";
import { RecipePage } from "@/components/docs/recipe-page";

export const Route = createFileRoute("/docs/recipes/forms")({
  component: FormsRecipe,
  head: () => ({
    meta: [
      { title: "Forms recipe · Novix UI" },
      { name: "description", content: "Grouped inputs with inline validation and consistent Label/Input spacing." },
    ],
  }),
});

function FormsRecipe() {
  return (
    <RecipePage
      eyebrow="Recipes · Product"
      title="Forms"
      description="Grouped inputs, inline validation, autocomplete-friendly semantics, and a clear primary action."
      preview={
        <form className="w-full max-w-md space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <Label htmlFor="f-name" required>Full name</Label>
            <Input id="f-name" autoComplete="name" placeholder="Ada Lovelace" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-email" required>Email</Label>
            <Input id="f-email" type="email" autoComplete="email" placeholder="ada@novix.dev" hint="We'll send a confirmation." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="f-org" optional>Organization</Label>
            <Input id="f-org" autoComplete="organization" placeholder="Nova, Inc." />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost">Cancel</Button>
            <Button>Create account</Button>
          </div>
        </form>
      }
      source={`import { Button, Input, Label } from "@novix-ui/react";

export function AccountForm({ onSubmit }) {
  return (
    <form className="max-w-md space-y-4" onSubmit={onSubmit}>
      <div className="space-y-1.5">
        <Label htmlFor="name" required>Full name</Label>
        <Input id="name" autoComplete="name" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email" required>Email</Label>
        <Input id="email" type="email" autoComplete="email" hint="We'll send a confirmation." />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" type="button">Cancel</Button>
        <Button type="submit">Create account</Button>
      </div>
    </form>
  );
}`}
      anatomy={[
        "Label above input, 6px gap. Hint text below input, muted.",
        "Required/optional indicator on the Label — pick one convention per form.",
        "Errors replace hint text. Set aria-invalid on the input.",
        "Primary action on the right; ghost cancel to the left.",
      ]}
      tip={{ variant: "accessibility", title: "Label every input", body: "Placeholder text is not a label. Even with a great design, screen readers need real Labels." }}
      related={[
        { title: "Input component", href: "/docs/components/input" },
        { title: "Label component", href: "/docs/components/label" },
        { title: "Authentication recipe", href: "/docs/recipes/authentication" },
      ]}
    />
  );
}
