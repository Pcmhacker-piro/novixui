import { createFileRoute } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { DocsShell, DocLead } from "@/components/docs/docs-shell";
import { HubGrid, type HubEntry } from "@/components/docs/hub-grid";

export const Route = createFileRoute("/docs/migration/")({
  component: MigrationIndex,
  head: () => ({
    meta: [
      { title: "Migration guides · Novix UI" },
      { name: "description", content: "Move from Tailwind UI, Chakra, MUI, Ant Design, and Bootstrap to Nova." },
      { property: "og:title", content: "Migration · Novix UI" },
      { property: "og:description", content: "Migration paths from popular UI libraries." },
    ],
  }),
});

const GUIDES: HubEntry[] = [
  { title: "From Tailwind UI", href: "/docs/migration/tailwind-ui", description: "Nova is a superset of Tailwind — you keep the utility class habit, gain composable primitives.", eyebrow: "Tailwind UI", icon: <Layers className="size-5" /> },
  { title: "From Chakra UI", href: "/docs/migration/chakra-ui", description: "Trade the style-prop system for utility classes and a stricter type-first API.", eyebrow: "Chakra UI", icon: <Layers className="size-5" /> },
  { title: "From Material UI", href: "/docs/migration/material-ui", description: "Replace MUI's runtime theming with CSS-first tokens and a slimmer surface.", eyebrow: "Material UI", icon: <Layers className="size-5" /> },
  { title: "From Ant Design", href: "/docs/migration/ant-design", description: "Nova favors clarity over density; expect fewer components with sharper defaults.", eyebrow: "Ant Design", icon: <Layers className="size-5" /> },
  { title: "From Bootstrap", href: "/docs/migration/bootstrap", description: "Utility classes replace pre-composed components. Same layout muscles, better craft.", eyebrow: "Bootstrap", icon: <Layers className="size-5" /> },
];

function MigrationIndex() {
  return (
    <DocsShell
      eyebrow="Migration"
      title="Migration guides"
      description="Move from your current library to Nova without rewriting the world."
    >
      <DocLead>
        Each guide is written from experience — mapping tables, code diffs, and the traps to avoid. Migrate one surface at a time; Nova lives happily alongside your existing components.
      </DocLead>
      <HubGrid entries={GUIDES} columns={2} />
    </DocsShell>
  );
}
