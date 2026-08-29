import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Avatar, Badge, Button, Card, Separator } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/team-management")({
  component: TeamTemplate,
  head: () => ({ meta: [{ title: "Team management template · Novix UI" }, { name: "description", content: "Members table, invites, and role management." }] }),
});

function TeamTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Product"
      title="Team management"
      description="A members table with role editing, pending invites, and offboarding flows."
      install={`npx @novix-ui/cli template add team`}
      includes={["Members table", "Role dropdowns", "Pending invites", "Offboarding confirmation"]}
      preview={
        <Card className="w-full p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Team members · 4</p>
            <Button size="sm" leadingIcon={<Plus className="size-3.5" />}>Invite</Button>
          </div>
          <Separator className="my-3" />
          <div className="space-y-2 text-sm">
            {[
              { n: "Ada Lovelace", r: "Owner" },
              { n: "Grace Hopper", r: "Admin" },
              { n: "Radia Perlman", r: "Member" },
              { n: "Katherine Johnson", r: "Member" },
            ].map((m) => (
              <div key={m.n} className="flex items-center justify-between rounded-md border border-border/50 p-2">
                <span className="inline-flex items-center gap-2"><Avatar size="xs" name={m.n} />{m.n}</span>
                <Badge variant="outline" size="sm">{m.r}</Badge>
              </div>
            ))}
          </div>
        </Card>
      }
      source={`// src/routes/_app/team.tsx
export function Team() {
  const { members } = Route.useLoaderData();
  return <MembersTable members={members} onInvite={invite} onRemove={remove} />;
}`}
    />
  );
}
