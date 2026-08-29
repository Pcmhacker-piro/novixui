import { createFileRoute } from "@tanstack/react-router";
import { Avatar, Badge, Button, Card } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/profile")({
  component: ProfileTemplate,
  head: () => ({ meta: [{ title: "Profile template · Novix UI" }, { name: "description", content: "A public profile with cover, bio, and pinned work." }] }),
});

function ProfileTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Product"
      title="Profile"
      description="A public profile — cover, avatar, bio, follow button, and pinned work grid."
      install={`npx @novix-ui/cli template add profile`}
      includes={["Cover image", "Bio card", "Follow / message", "Pinned work grid"]}
      preview={
        <Card className="w-full overflow-hidden p-0">
          <div className="h-16 bg-gradient-to-r from-accent/30 to-primary/20" />
          <div className="flex items-end justify-between p-4">
            <div className="flex items-end gap-3">
              <Avatar size="lg" ring="strong" name="Ada Lovelace" className="-mt-8" />
              <div>
                <p className="text-sm font-semibold">Ada Lovelace</p>
                <p className="text-xs text-muted-foreground">Mathematician · London</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">Message</Button>
              <Button size="sm">Follow</Button>
            </div>
          </div>
          <div className="grid gap-2 border-t border-border/60 p-4 sm:grid-cols-3">
            {["Notes on the Analytical Engine", "Bernoulli algorithm", "Novix UI"].map((w) => (
              <Card key={w} className="p-3">
                <p className="text-xs font-semibold">{w}</p>
                <Badge variant="outline" size="sm" className="mt-2">Pinned</Badge>
              </Card>
            ))}
          </div>
        </Card>
      }
      source={`// src/routes/@$handle.tsx — profile route`}
    />
  );
}
