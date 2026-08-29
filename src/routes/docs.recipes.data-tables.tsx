import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/nova";
import { RecipePage } from "@/components/docs/recipe-page";

export const Route = createFileRoute("/docs/recipes/data-tables")({
  component: DataTableRecipe,
  head: () => ({
    meta: [
      { title: "Data tables recipe · Novix UI" },
      { name: "description", content: "Sortable, filterable data tables with sticky headers and inline actions." },
    ],
  }),
});

const ROWS = [
  { name: "Ada Lovelace", team: "Engineering", role: "Owner", status: "Active" },
  { name: "Grace Hopper", team: "Design", role: "Admin", status: "Active" },
  { name: "Radia Perlman", team: "Engineering", role: "Member", status: "Invited" },
  { name: "Katherine Johnson", team: "Product", role: "Admin", status: "Active" },
];

function DataTableRecipe() {
  return (
    <RecipePage
      eyebrow="Recipes · Product"
      title="Data tables"
      description="A workspace members table with sticky header, striped rows, inline status badges, and empty-friendly design."
      preview={
        <div className="w-full overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-subtle/60 text-left">
              <tr>
                {["Name", "Team", "Role", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={r.name} className={i > 0 ? "border-t border-border/50" : ""}>
                  <td className="px-3 py-2 font-medium">{r.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.team}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.role}</td>
                  <td className="px-3 py-2">
                    <Badge variant="outline" size="sm">{r.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      source={`export function MembersTable({ rows }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-subtle/60 text-left">
        <tr>
          <th>Name</th><th>Team</th><th>Role</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className="border-t">
            <td className="px-3 py-2 font-medium">{r.name}</td>
            <td className="px-3 py-2 text-muted-foreground">{r.team}</td>
            <td className="px-3 py-2 text-muted-foreground">{r.role}</td>
            <td className="px-3 py-2">
              <Badge variant="outline" size="sm">{r.status}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`}
      anatomy={[
        "Header uses uppercase mono at 11px for a data-heavy feel.",
        "Row separators via 1px borders — never full-width strong dividers.",
        "Status column always uses Badge for consistent semantics.",
        "Wrap the table in overflow-x-auto for narrow viewports.",
      ]}
      tip={{ variant: "accessibility", title: "Semantic table always", body: "Use real table markup so screen readers can navigate rows and columns. Div-based grids feel modern but break assistive tech." }}
      related={[
        { title: "Dashboard recipe", href: "/docs/recipes/dashboard" },
        { title: "Skeleton loading", href: "/docs/components/skeleton" },
        { title: "Empty states", href: "/docs/recipes/empty-states" },
      ]}
    />
  );
}
