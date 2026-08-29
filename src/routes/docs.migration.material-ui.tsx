import { createFileRoute } from "@tanstack/react-router";
import { MigrationPage } from "@/components/docs/migration-page";

export const Route = createFileRoute("/docs/migration/material-ui")({
  component: MUIMigration,
  head: () => ({ meta: [{ title: "Migrate from Material UI · Novix UI" }, { name: "description", content: "Replace MUI's runtime theming with Nova's CSS tokens." }] }),
});

function MUIMigration() {
  return (
    <MigrationPage
      eyebrow="Migration"
      title="From Material UI"
      description="MUI is comprehensive but heavy — a full theme engine, a lot of runtime CSS-in-JS. Nova gives you a smaller surface with sharper defaults and better tree-shaking."
      overview="Nova doesn't try to replicate Material Design. If you need Material's exact metaphors, stay. If you're using MUI as a generic library, Nova is a lighter, more opinionated alternative."
      install={`bun add @novix-ui/react\n# incremental: keep @mui/material installed during migration`}
      mapping={[
        { from: "Button (contained/outlined/text)", to: "Button (primary/outline/ghost)", notes: "Same intent spectrum." },
        { from: "IconButton", to: "IconButton", notes: "aria-label required by types." },
        { from: "TextField", to: "Input + Label", notes: "Nova splits the monolith into composable pieces." },
        { from: "Paper", to: "Card", notes: "Nova's Card has the Moon-Edge highlight built in." },
        { from: "ThemeProvider (MUI)", to: "ThemeProvider (Nova)", notes: "Sets CSS tokens instead of context objects." },
      ]}
      diffBefore={`<Button variant="contained" color="primary" startIcon={<SearchIcon />}>
  Search
</Button>`}
      diffAfter={`import { Button } from "@novix-ui/react";
import { Search } from "lucide-react";

<Button variant="primary" leadingIcon={<Search />}>Search</Button>`}
      traps={[
        "MUI uses Emotion under the hood. Nova has no CSS-in-JS runtime — remove Emotion once you're fully migrated to shrink the bundle.",
        "MUI's sx prop won't work on Nova components. Use className with Tailwind utilities.",
        "Material Design elevation is stateful; Nova's Card ships one layered shadow. Don't try to recreate the 24 MUI elevation levels — Nova uses two.",
      ]}
      callouts={[{ variant: "warning", title: "Migrate incrementally", body: "MUI has a large surface. Don't try to swap everything in one PR — replace one route at a time." }]}
    />
  );
}
