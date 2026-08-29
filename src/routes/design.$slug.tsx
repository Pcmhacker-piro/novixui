import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SYSTEMS, buildServiceSite } from "./design";

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
    <div className="grid min-h-screen place-items-center bg-black text-white">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-white/50">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Design system not found</h1>
        <Link to="/design" className="mt-4 inline-block rounded-md bg-white px-4 py-2 text-sm font-semibold text-black">
          Back to all systems
        </Link>
      </div>
    </div>
  ),
});

function SystemSitePage() {
  const { system } = Route.useLoaderData();
  const html = buildServiceSite(system);
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-6">
          <Link
            to="/design"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft className="size-3.5" /> All systems
          </Link>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{system.name}</div>
            <div className="truncate font-mono text-[10px] uppercase tracking-widest text-white/40">
              {system.slug}.studio · live preview
            </div>
          </div>
          <span
            className={`ml-auto rounded border px-2 py-0.5 text-[11px] font-medium ${
              system.tag === "Free"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-white/10 bg-white/5 text-white/70"
            }`}
          >
            {system.tag}
          </span>
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
