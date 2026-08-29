import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Input, Label, Separator } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/settings")({
  component: SettingsTemplate,
  head: () => ({ meta: [{ title: "Settings template · Novix UI" }, { name: "description", content: "Sectioned settings page with sticky nav and danger zone." }] }),
});

function SettingsTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Product"
      title="Settings"
      description="Sectioned settings with sticky in-page nav on desktop, save-per-section, and a distinct destructive zone."
      install={`npx @novix-ui/cli template add settings`}
      routes={["src/routes/_app/settings.tsx"]}
      includes={["Section nav", "Form groups", "Danger zone", "Per-section save"]}
      preview={
        <div className="w-full space-y-3">
          <Card className="p-4">
            <p className="text-sm font-semibold">Profile</p>
            <Separator className="my-3" />
            <div className="space-y-1.5">
              <Label htmlFor="t-name">Display name</Label>
              <Input id="t-name" defaultValue="Ada Lovelace" />
            </div>
            <div className="mt-3 flex justify-end"><Button size="sm">Save</Button></div>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-semibold text-danger">Danger zone</p>
            <Separator className="my-3" />
            <div className="flex items-center justify-between text-sm">
              <span>Delete workspace</span>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </Card>
        </div>
      }
      source={`// src/routes/_app/settings.tsx — see recipes/settings for the full source`}
    />
  );
}
