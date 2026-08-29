import { createFileRoute } from "@tanstack/react-router";
import { MigrationPage } from "@/components/docs/migration-page";

export const Route = createFileRoute("/docs/migration/bootstrap")({
  component: BootstrapMigration,
  head: () => ({ meta: [{ title: "Migrate from Bootstrap · Novix UI" }, { name: "description", content: "Move from Bootstrap classes to Nova components and utilities." }] }),
});

function BootstrapMigration() {
  return (
    <MigrationPage
      eyebrow="Migration"
      title="From Bootstrap"
      description="Bootstrap is pre-composed and opinionated in a different direction. Moving to Nova + Tailwind trades pre-built components for composable primitives with sharper craft."
      overview="Expect two changes: your utility class vocabulary shifts to Tailwind's, and pre-composed Bootstrap components become Nova React primitives."
      install={`bun add @novix-ui/react tailwindcss\n# remove bootstrap.css after the migration finishes`}
      mapping={[
        { from: ".btn.btn-primary", to: "Button", notes: "Variants: primary/secondary/outline/ghost." },
        { from: ".form-control", to: "Input + Label", notes: "Composable — no monolith wrapper." },
        { from: ".card", to: "Card", notes: "Sculpted depth and Moon-Edge highlight." },
        { from: ".badge", to: "Badge", notes: "Same intent, tighter typography." },
        { from: ".d-flex .gap-2", to: "flex gap-2 (Tailwind)", notes: "Utilities are 1:1 in most cases." },
      ]}
      diffBefore={`<button type="button" class="btn btn-primary d-inline-flex align-items-center gap-2">
  <i class="bi bi-search"></i>
  Search
</button>`}
      diffAfter={`import { Button } from "@novix-ui/react";
import { Search } from "lucide-react";

<Button leadingIcon={<Search />}>Search</Button>`}
      traps={[
        "Bootstrap's grid uses 12 columns. Tailwind uses 12 by default too — but you'll typically reach for CSS grid + auto-fit for cards. Rewrite grids for the new mental model.",
        "Bootstrap's modal uses jQuery in older versions. Use the Modal workflows recipe with Radix Dialog.",
        "Bootstrap icons (bi) → lucide-react. Both use similar naming for common glyphs.",
      ]}
      callouts={[{ variant: "tip", title: "Migrate the app shell first", body: "Replace nav, header, and footer first. That unlocks Nova tokens across the whole app for every downstream page." }]}
    />
  );
}
