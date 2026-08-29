import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Input, Label, Separator } from "@/nova";
import { RecipePage } from "@/components/docs/recipe-page";

export const Route = createFileRoute("/docs/recipes/settings")({
  component: SettingsRecipe,
  head: () => ({
    meta: [
      { title: "Settings recipe · Novix UI" },
      { name: "description", content: "Sectioned settings page with form groups and a destructive zone." },
    ],
  }),
});

function SettingsRecipe() {
  return (
    <RecipePage
      eyebrow="Recipes · Product"
      title="Settings page"
      description="A three-section settings layout — profile, notifications, danger zone — with sticky in-page nav on desktop."
      preview={
        <div className="w-full max-w-2xl space-y-6">
          <Card className="p-5">
            <p className="text-sm font-semibold">Profile</p>
            <p className="text-xs text-muted-foreground">This information is shown on your public profile.</p>
            <Separator className="my-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="s-name">Display name</Label>
                <Input id="s-name" defaultValue="Ada Lovelace" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-handle">Handle</Label>
                <Input id="s-handle" defaultValue="ada" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button>Save changes</Button>
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-danger">Danger zone</p>
            <p className="text-xs text-muted-foreground">These actions are permanent.</p>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete workspace</p>
                <p className="text-xs text-muted-foreground">This will remove all data — no undo.</p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </Card>
        </div>
      }
      source={`import { Button, Card, Input, Label, Separator } from "@novix-ui/react";

export function Settings() {
  return (
    <div className="max-w-2xl space-y-6">
      <Card className="p-5">
        <h2 className="font-semibold">Profile</h2>
        <Separator className="my-4" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" defaultValue="Ada Lovelace" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Save changes</Button>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="font-semibold text-danger">Danger zone</h2>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <p className="text-sm">Delete workspace</p>
          <Button variant="destructive">Delete</Button>
        </div>
      </Card>
    </div>
  );
}`}
      anatomy={[
        "Sectioned Cards with a title, description, Separator, and body.",
        "One primary Save button per section — never a global save bar.",
        "Danger zone at the bottom, with destructive Button variants.",
        "Optional in-page anchor nav for long settings pages.",
      ]}
      tip={{ variant: "best-practice", title: "Save per section, not per page", body: "Global save bars hide what changed. Per-section saves make the mental model obvious." }}
      related={[
        { title: "Forms recipe", href: "/docs/recipes/forms" },
        { title: "Settings template", href: "/docs/templates/settings" },
      ]}
    />
  );
}
