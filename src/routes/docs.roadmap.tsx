import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/nova";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";

export const Route = createFileRoute("/docs/roadmap")({
  component: RoadmapPage,
  head: () => ({
    meta: [
      { title: "Roadmap · Novix UI" },
      { name: "description", content: "Ten-release cycle from v0.1 Foundation to v1.0 Nova. See what's shipping and when." },
      { property: "og:title", content: "Roadmap · Novix UI" },
      { property: "og:description", content: "Ten-release cycle from v0.1 Foundation to v1.0 Nova." },
    ],
  }),
});

const RELEASES = [
  { v: "v0.1", name: "Foundation", status: "shipped", body: "Button, Badge, Card, Input, Avatar, Icon, IconButton, Kbd, Label, Separator, Skeleton, Spinner." },
  { v: "v0.2", name: "Composition", status: "next", body: "Dialog, Popover, DropdownMenu, Tooltip, Toast, Sheet." },
  { v: "v0.3", name: "Data", status: "planned", body: "DataTable, Combobox, Pagination, Select, Command." },
  { v: "v0.4", name: "Theme Generator", status: "planned", body: "OKLCH palette generator, contrast validator, exportable token bundles." },
  { v: "v0.5", name: "AI Native", status: "planned", body: "Chat, PromptInput, ThinkingIndicator, StreamHalo — first-class AI primitives." },
  { v: "v0.6", name: "Motion", status: "planned", body: "Aperture transitions, shared elements, page choreography helpers." },
  { v: "v0.7", name: "Blocks", status: "planned", body: "Full compositions: hero, pricing, auth, dashboard shells." },
  { v: "v0.8", name: "Templates", status: "planned", body: "SaaS admin, AI chat app, marketing site starters." },
  { v: "v0.9", name: "CLI", status: "planned", body: "init, add, theme, diff, doctor — the full command surface." },
  { v: "v1.0", name: "Nova", status: "planned", body: "Stability guarantees, SemVer commitment, LTS release cadence." },
];

function statusVariant(s: string) {
  if (s === "shipped") return "success";
  if (s === "next") return "accent";
  return "outline";
}

function RoadmapPage() {
  return (
    <DocsShell
      eyebrow="Explore"
      title="Roadmap"
      description="Ten releases from Foundation to Nova. Each release ships a self-contained layer of the design system — never a breaking rewrite."
    >
      <DocLead>
        The roadmap is a promise, not a wishlist. Every release below has an owner and a target
        window. Slip is possible; scope is not.
      </DocLead>

      <div className="mt-10 space-y-3">
        {RELEASES.map((r) => (
          <div key={r.v} className="nova-card-surface flex flex-col gap-2 rounded-xl p-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex w-40 shrink-0 items-center gap-3">
              <span className="font-mono text-[13px] font-semibold text-foreground">{r.v}</span>
              <span className="text-sm font-medium">{r.name}</span>
            </div>
            <p className="flex-1 text-[13.5px] leading-relaxed text-muted-foreground">{r.body}</p>
            <Badge
              variant={statusVariant(r.status) as "outline"}

              size="sm"
              className="capitalize"
              dot={r.status !== "planned"}
            >
              {r.status}
            </Badge>
          </div>
        ))}
      </div>

      <DocSection id="feedback" title="Have a request?">
        <p className="text-sm text-muted-foreground">
          Priorities are shaped by what teams actually ship. Open a discussion on GitHub and tell us
          what would unblock you.
        </p>
      </DocSection>
    </DocsShell>
  );
}
