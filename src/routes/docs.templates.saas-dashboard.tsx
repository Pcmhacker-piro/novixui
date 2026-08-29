import { createFileRoute } from "@tanstack/react-router";
import { Bell, Home, Search, Settings } from "lucide-react";
import { Avatar, Badge, Button, Card, IconButton, Input, Separator } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/saas-dashboard")({
  component: SaaSTemplate,
  head: () => ({
    meta: [
      { title: "SaaS Dashboard template · Novix UI" },
      { name: "description", content: "Full-app SaaS scaffold — sidebar, header, KPIs, and workspace table." },
    ],
  }),
});

function SaaSTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Full app"
      title="SaaS Dashboard"
      description="A production-shaped SaaS shell — collapsible sidebar, search-first header, KPI row, and members table."
      install={`npx @novix-ui/cli template add saas-dashboard`}
      routes={["src/routes/_app/index.tsx", "src/routes/_app/members.tsx", "src/routes/_app/settings.tsx"]}
      includes={["Sidebar nav", "Global search", "KPI cards", "Members table", "Settings scaffold", "Empty states"]}
      notes="Wire the loader to your data source (Supabase, Prisma, tRPC, REST). Skeletons ship for every table row."
      preview={
        <div className="grid w-full grid-cols-[160px_1fr] overflow-hidden rounded-xl border border-border/70 text-sm">
          <aside className="space-y-1 border-r border-border/60 bg-subtle/40 p-3">
            {[
              { icon: <Home className="size-4" />, label: "Home", active: true },
              { icon: <Search className="size-4" />, label: "Search" },
              { icon: <Bell className="size-4" />, label: "Inbox" },
              { icon: <Settings className="size-4" />, label: "Settings" },
            ].map((i) => (
              <div key={i.label} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${i.active ? "bg-accent/10 text-accent" : "text-muted-foreground"}`}>
                {i.icon}{i.label}
              </div>
            ))}
          </aside>
          <div>
            <header className="flex items-center justify-between border-b border-border/60 px-3 py-2">
              <Input placeholder="Search…" leadingIcon={<Search className="size-3.5" />} className="h-8 max-w-xs" />
              <div className="flex items-center gap-2">
                <IconButton size="sm" aria-label="Notifications"><Bell /></IconButton>
                <Avatar size="sm" name="Ada Lovelace" />
              </div>
            </header>
            <div className="grid gap-2 p-3 sm:grid-cols-3">
              {[
                { l: "Users", v: "12.4k" },
                { l: "MRR", v: "$42k" },
                { l: "Churn", v: "1.2%" },
              ].map((k) => (
                <Card key={k.l} className="p-3">
                  <p className="text-[11px] text-muted-foreground">{k.l}</p>
                  <p className="mt-1 text-lg font-semibold">{k.v}</p>
                </Card>
              ))}
            </div>
            <Separator />
            <div className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Members</p>
                <Button size="sm">Invite</Button>
              </div>
              <div className="mt-2 space-y-1 text-xs">
                {["Ada", "Grace", "Radia"].map((n) => (
                  <div key={n} className="flex items-center justify-between rounded-md border border-border/50 p-2">
                    <span className="inline-flex items-center gap-2"><Avatar size="xs" name={n} />{n}</span>
                    <Badge variant="outline" size="sm">Admin</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
      source={`// src/routes/_app/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Avatar, Badge, Button, Card, IconButton, Input, Separator } from "@novix-ui/react";
// ...import your loader & UI

export const Route = createFileRoute("/_app/")({
  component: DashboardHome,
  loader: async () => await fetchWorkspaceStats(),
});

function DashboardHome() {
  const { kpis, members } = Route.useLoaderData();
  return (
    <AppShell>
      <KpiRow kpis={kpis} />
      <MembersCard members={members} />
    </AppShell>
  );
}`}
    />
  );
}
