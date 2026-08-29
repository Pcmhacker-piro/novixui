import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/nova";
import { DocsShell, DocLead } from "@/components/docs/docs-shell";

export const Route = createFileRoute("/docs/changelog")({
  component: ChangelogPage,
  head: () => ({
    meta: [
      { title: "Changelog · Novix UI" },
      { name: "description", content: "Every Novix UI release, in reverse chronological order." },
      { property: "og:title", content: "Changelog · Novix UI" },
      { property: "og:description", content: "Every Novix UI release, in reverse chronological order." },
    ],
  }),
});

const ENTRIES = [
  {
    v: "0.1.0",
    date: "2026-07-17",
    tag: "Foundation",
    added: [
      "Button, IconButton, Badge, Card, Input, Avatar, Icon, Kbd, Label, Separator, Skeleton, Spinner.",
      "OKLCH semantic token system with Tailwind v4 wiring.",
      "ThemeProvider with system/light/dark and cross-fade transition.",
      "Docs shell: sticky sidebar, live TOC, ⌘K palette, copy-to-clipboard.",
    ],
  },
  {
    v: "0.0.3",
    date: "2026-07-10",
    tag: "Design",
    added: ["Signature material system: Moon-Edge, Halo Hover, Press Sink."],
  },
  {
    v: "0.0.2",
    date: "2026-07-04",
    tag: "Architecture",
    added: ["Design Language + Engineering Specification documents."],
  },
  {
    v: "0.0.1",
    date: "2026-06-28",
    tag: "Genesis",
    added: ["Novix UI monorepo bootstrapped. First tokens landed."],
  },
];

function ChangelogPage() {
  return (
    <DocsShell
      eyebrow="Explore"
      title="Changelog"
      description="Everything we've shipped, in reverse chronological order. Nova follows SemVer once v1.0 lands — pre-v1 releases may include curated breaking changes."
    >
      <DocLead>
        Follow releases on GitHub or subscribe to the RSS feed. Every entry is human-written.
      </DocLead>

      <div className="mt-10 space-y-8">
        {ENTRIES.map((e) => (
          <article key={e.v} className="grid gap-3 sm:grid-cols-[10rem_1fr]">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[13px] font-semibold">v{e.v}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{e.date}</span>
              <Badge variant="outline" size="sm" className="mt-1 w-fit">
                {e.tag}
              </Badge>
            </div>
            <div className="nova-card-surface rounded-xl p-5">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                Added
              </p>
              <ul className="space-y-2 text-[13.5px] leading-relaxed text-muted-foreground">
                {e.added.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-2 inline-block size-1 shrink-0 rounded-full bg-accent" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </DocsShell>
  );
}
