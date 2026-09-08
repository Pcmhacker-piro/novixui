import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { SYSTEMS, buildServiceSite } from "@/data/design-systems";
import { IconButton, useTheme } from "@/nova";

export const Route = createFileRoute("/design/$slug")({
  loader: ({ params }) => {
    const system = SYSTEMS.find((s) => s.slug === params.slug);
    if (!system) throw notFound();
    return { system };
  },
  head: ({ params, loaderData }) => {
    const s = loaderData?.system;
    const title = s ? `${s.name} — Live site · Novix UI` : "Design system · Novix UI";
    const desc = s?.desc ?? "Novix UI design system preview.";
    const url = `/design/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: SystemSitePage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background text-foreground dark:bg-black dark:text-white">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Design system not found</h1>
        <Link to="/design" className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">
          Back to all systems
        </Link>
      </div>
    </div>
  ),
});

function SystemSitePage() {
  const { system } = Route.useLoaderData();
  const { resolvedTheme, toggle } = useTheme();
  const html = buildServiceSite(system);
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-[#050505] dark:text-white">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/70">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
          <Link
            to="/design"
            className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-subtle/50 px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-subtle dark:border-white/10 dark:bg-transparent dark:text-white/80 dark:hover:bg-white/[0.05] dark:hover:text-white"
          >
            <ArrowLeft className="size-3.5" /> All systems
          </Link>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground dark:text-white">{system.name}</div>
            <div className="truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground dark:text-white/40">
              {system.slug}.studio · live preview
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <IconButton
              aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "night"} mode`}
              onClick={toggle}
              variant="ghost"
              size="sm"
              icon={
                resolvedTheme === "dark" ? (
                  <Sun size={15} className="text-amber-400" />
                ) : (
                  <Moon size={15} className="text-indigo-600" />
                )
              }
              className="border border-border/80 bg-subtle/80 text-foreground transition-colors hover:bg-muted dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            />
            <span
              className={`rounded border px-2 py-0.5 text-[11px] font-medium ${
                system.tag === "Free"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                  : "border-border bg-subtle text-foreground dark:border-white/10 dark:bg-white/5 dark:text-white/70"
              }`}
            >
              {system.tag}
            </span>
          </div>
        </div>
      </header>
      <iframe
        title={`${system.name} live site`}
        srcDoc={html}
        sandbox="allow-scripts allow-same-origin"
        className="block h-[calc(100vh-56px)] w-full border-0 bg-white"
      />
    </div>
  );
}
