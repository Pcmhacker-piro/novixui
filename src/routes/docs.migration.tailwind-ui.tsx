import { createFileRoute } from "@tanstack/react-router";
import { MigrationPage } from "@/components/docs/migration-page";

export const Route = createFileRoute("/docs/migration/tailwind-ui")({
  component: TailwindUIMigration,
  head: () => ({ meta: [{ title: "Migrate from Tailwind UI · Novix UI" }, { name: "description", content: "Move Tailwind UI templates into Novix UI without losing utility habits." }] }),
});

function TailwindUIMigration() {
  return (
    <MigrationPage
      eyebrow="Migration"
      title="From Tailwind UI"
      description="Nova extends the Tailwind mental model with type-safe, accessible primitives. You keep the class habit and drop the copy-paste maintenance."
      overview="Tailwind UI ships as HTML snippets. Nova ships composable React primitives styled with Tailwind v4. Migration is largely 1:1 — wrap regions in Nova components and delete the boilerplate classes they replace."
      install={`bun add @novix-ui/react\n# leave your existing Tailwind config as-is`}
      mapping={[
        { from: "Custom <button> classes", to: "Button", notes: "Variants replace repeated class strings." },
        { from: "Icon <button> variant", to: "IconButton", notes: "Enforces aria-label at type level." },
        { from: "Card wrapper divs", to: "Card", notes: "Includes Moon-Edge highlight for free." },
        { from: "Custom Kbd spans", to: "Kbd / KbdSequence", notes: "Platform-aware ⌘ vs Ctrl." },
        { from: "Loading placeholders", to: "Skeleton", notes: "Shimmer + reduced-motion pulse." },
      ]}
      diffBefore={`<button class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400">
  <svg .../>
  Continue
</button>`}
      diffAfter={`import { Button } from "@novix-ui/react";
import { ArrowRight } from "lucide-react";

<Button trailingIcon={<ArrowRight />}>Continue</Button>`}
      traps={[
        "Tailwind UI's focus ring uses one layer. Nova ships a two-layer ring for contrast on any surface — don't override it.",
        "Some Tailwind UI patterns nest links inside buttons; that's invalid HTML. Use Button's asChild to render onto a Link.",
        "Tailwind UI grays are neutral-based; Nova's are OKLCH. Colors will shift subtly — recalibrate custom tokens in styles.css, not in components.",
      ]}
      callouts={[
        { variant: "tip", title: "Keep the templates as reference", body: "You don't have to rewrite everything at once. Nova composes cleanly inside a Tailwind UI shell." },
      ]}
    />
  );
}
