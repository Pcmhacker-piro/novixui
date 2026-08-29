import { createFileRoute } from "@tanstack/react-router";
import { RecipePage } from "@/components/docs/recipe-page";

export const Route = createFileRoute("/docs/recipes/documentation-layout")({
  component: DocsRecipe,
  head: () => ({
    meta: [
      { title: "Documentation layout recipe · Novix UI" },
      { name: "description", content: "The three-column shell used by these docs — sidebar, article, TOC." },
    ],
  }),
});

function DocsRecipe() {
  return (
    <RecipePage
      eyebrow="Recipes · Layout"
      title="Documentation layout"
      description="The three-column shell used by the Nova docs themselves — sticky sidebar, article, and a floating table of contents."
      preview={
        <div className="grid w-full grid-cols-[180px_1fr_140px] overflow-hidden rounded-xl border border-border/70 text-xs">
          <aside className="border-r border-border/60 bg-subtle/40 p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Getting started</p>
            <ul className="mt-2 space-y-1 text-foreground">
              <li className="rounded px-2 py-1 bg-accent/10 text-accent">Introduction</li>
              <li className="px-2 py-1 text-muted-foreground">Installation</li>
              <li className="px-2 py-1 text-muted-foreground">Quick start</li>
            </ul>
          </aside>
          <article className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Docs</p>
            <h1 className="mt-1 text-base font-semibold">Introduction</h1>
            <p className="mt-2 text-muted-foreground">Novix UI is a premium React component library…</p>
          </article>
          <aside className="border-l border-border/60 p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">On this page</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li className="text-accent">Overview</li>
              <li>Install</li>
              <li>First component</li>
            </ul>
          </aside>
        </div>
      }
      source={`export function DocsShell({ children, toc }) {
  return (
    <div className="mx-auto grid max-w-[92rem] grid-cols-[240px_minmax(0,1fr)_200px] gap-8">
      <aside className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <SidebarNav />
      </aside>
      <article className="min-w-0 py-10">{children}</article>
      <aside className="sticky top-16 h-[calc(100vh-4rem)]">
        <TableOfContents items={toc} />
      </aside>
    </div>
  );
}`}
      anatomy={[
        "Sidebar collapses to a sheet under lg.",
        "Article region caps at ~70ch for readability.",
        "TOC uses IntersectionObserver to highlight the active section.",
        "Reading progress bar spans the top of the article.",
      ]}
      related={[
        { title: "DocsShell source", href: "https://github.com/novix-ui" },
        { title: "Documentation template", href: "/docs/templates/documentation-site" },
      ]}
    />
  );
}
