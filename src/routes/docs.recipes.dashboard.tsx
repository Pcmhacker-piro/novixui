import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Bell, ChevronRight, Search, Settings } from "lucide-react";
import { Avatar, AvatarGroup, Badge, Button, Card, IconButton, Input, Separator } from "@/nova";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const Route = createFileRoute("/docs/recipes/dashboard")({
  component: DashboardRecipe,
  head: () => ({
    meta: [
      { title: "Dashboard recipe · Novix UI" },
      { name: "description", content: "A sidebar dashboard composed from Nova primitives — KPIs, activity, and a data table." },
      { property: "og:title", content: "Dashboard recipe · Novix UI" },
      { property: "og:description", content: "A sidebar dashboard composed from Nova primitives." },
    ],
  }),
});

const KPIS = [
  { label: "Active users", value: "12,481", delta: "+8.2%" },
  { label: "MRR", value: "$42,908", delta: "+3.1%" },
  { label: "Latency p95", value: "184ms", delta: "-12ms" },
];

const ROWS = [
  { name: "Ada Lovelace", plan: "Team", status: "Active" },
  { name: "Grace Hopper", plan: "Pro", status: "Trialing" },
  { name: "Radia Perlman", plan: "Team", status: "Active" },
];

function DashboardRecipe() {
  return (
    <DocsShell
      eyebrow="Recipes · Layout"
      title="Dashboard"
      description="A three-region app shell with a sidebar, a stat header, and a data table. Every element is a Nova primitive — no custom CSS beyond the utility layer."
      toc={[
        { id: "preview", label: "Preview" },
        { id: "code", label: "Full source" },
        { id: "breakdown", label: "Anatomy" },
        { id: "swap", label: "Swap in your data" },
        { id: "related", label: "Related" },
      ]}
    >
      <DocSection id="preview" title="Preview">
        <DocLead>The layout below is the actual composition. Resize the preview to see how it stacks.</DocLead>
        <ComponentPreview
          className="mt-6"
          align="start"
          code={SOURCE}
        >
          <div className="w-full rounded-xl border border-border/70 bg-background">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="size-6 rounded-md bg-accent" />
                <p className="text-sm font-semibold">Nova Console</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:block">
                  <Input leadingIcon={<Search className="size-4" />} placeholder="Search…" className="h-8" />
                </div>
                <IconButton aria-label="Notifications"><Bell /></IconButton>
                <Avatar name="Ada Lovelace" size="sm" />
              </div>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-3">
              {KPIS.map((k) => (
                <Card key={k.label} className="p-4">
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight">{k.value}</p>
                  <Badge variant="outline" size="sm" className="mt-2">{k.delta}</Badge>
                </Card>
              ))}
            </div>
            <Separator />
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Recent customers</p>
                <Button variant="ghost" size="sm" trailingIcon={<ArrowUpRight className="size-4" />}>View all</Button>
              </div>
              <div className="overflow-hidden rounded-lg border border-border/60">
                <table className="w-full text-sm">
                  <thead className="bg-subtle/50 text-left">
                    <tr>
                      <th className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Name</th>
                      <th className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Plan</th>
                      <th className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((r, i) => (
                      <tr key={r.name} className={i > 0 ? "border-t border-border/50" : ""}>
                        <td className="flex items-center gap-2 px-3 py-2"><Avatar size="xs" name={r.name} />{r.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.plan}</td>
                        <td className="px-3 py-2"><Badge variant="outline" size="sm">{r.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <AvatarGroup max={3}>
                    <Avatar size="xs" name="Ada L" />
                    <Avatar size="xs" name="Grace H" />
                    <Avatar size="xs" name="Radia P" />
                    <Avatar size="xs" name="Katherine J" />
                  </AvatarGroup>
                  <span>4 admins online</span>
                </div>
                <span className="inline-flex items-center gap-1">Updated 2s ago <ChevronRight className="size-3" /></span>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </DocSection>

      <DocSection id="code" title="Full source">
        <CodeBlock code={SOURCE} />
      </DocSection>

      <DocSection id="breakdown" title="Anatomy">
        <ul className="mt-2 space-y-3 text-sm text-muted-foreground">
          <li><span className="font-medium text-foreground">Top bar</span> — brand, global Search input, notifications IconButton, user Avatar.</li>
          <li><span className="font-medium text-foreground">KPI row</span> — three Cards side-by-side. Use <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">grid-cols-3</code> on lg, stack on mobile.</li>
          <li><span className="font-medium text-foreground">Table</span> — semantic HTML with subtle striping. Wrap rows in Link when navigable.</li>
          <li><span className="font-medium text-foreground">Footer strip</span> — AvatarGroup for presence, timestamp on the right.</li>
        </ul>
        <Callout variant="tip" className="mt-4" title="Data density scales with viewport">
          Under 768px, collapse the KPI grid to a single column and hide the notifications button behind a menu.
        </Callout>
      </DocSection>

      <DocSection id="swap" title="Swap in your data">
        <p className="text-sm text-muted-foreground">Replace the local <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">KPIS</code> and <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">ROWS</code> arrays with your loader data. Add Skeleton placeholders while data is in flight.</p>
      </DocSection>

      <DocSection id="related" title="Related">
        <ul className="mt-2 space-y-2 text-sm">
          <li><a className="text-accent underline-offset-4 hover:underline" href="/docs/recipes/data-tables">Data tables recipe</a> — for sortable, filterable rows.</li>
          <li><a className="text-accent underline-offset-4 hover:underline" href="/docs/recipes/empty-states">Empty states</a> — for the zero-data version of the same table.</li>
          <li><a className="text-accent underline-offset-4 hover:underline" href="/docs/templates/saas-dashboard">SaaS dashboard template</a> — full app scaffold using this recipe.</li>
        </ul>
      </DocSection>
    </DocsShell>
  );
}

const SOURCE = `import { Avatar, AvatarGroup, Badge, Button, Card, IconButton, Input, Separator } from "@novix-ui/react";
import { ArrowUpRight, Bell, ChevronRight, Search } from "lucide-react";

const KPIS = [
  { label: "Active users", value: "12,481", delta: "+8.2%" },
  { label: "MRR", value: "$42,908", delta: "+3.1%" },
  { label: "Latency p95", value: "184ms", delta: "-12ms" },
];

const ROWS = [
  { name: "Ada Lovelace", plan: "Team", status: "Active" },
  { name: "Grace Hopper", plan: "Pro", status: "Trialing" },
  { name: "Radia Perlman", plan: "Team", status: "Active" },
];

export function Dashboard() {
  return (
    <div className="rounded-xl border bg-background">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="size-6 rounded-md bg-accent" />
          <p className="font-semibold">Nova Console</p>
        </div>
        <div className="flex items-center gap-2">
          <Input leadingIcon={<Search className="size-4" />} placeholder="Search…" className="h-8" />
          <IconButton aria-label="Notifications"><Bell /></IconButton>
          <Avatar name="Ada Lovelace" size="sm" />
        </div>
      </header>

      <div className="grid gap-3 p-4 sm:grid-cols-3">
        {KPIS.map((k) => (
          <Card key={k.label} className="p-4">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-xl font-semibold">{k.value}</p>
            <Badge variant="outline" size="sm" className="mt-2">{k.delta}</Badge>
          </Card>
        ))}
      </div>

      <Separator />

      <section className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold">Recent customers</p>
          <Button variant="ghost" size="sm" trailingIcon={<ArrowUpRight className="size-4" />}>
            View all
          </Button>
        </div>
        {/* table */}
      </section>
    </div>
  );
}`;
