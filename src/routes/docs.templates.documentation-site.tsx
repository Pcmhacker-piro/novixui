import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/documentation-site")({
  component: DocsTemplate,
  head: () => ({ meta: [{ title: "Documentation site template · Novix UI" }, { name: "description", content: "A three-column documentation site with sidebar and TOC." }] }),
});

function DocsTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Content"
      title="Documentation site"
      description="The exact shell that powers these docs — sidebar, article, table of contents, reading progress, ⌘K."
      install={`npx @novix-ui/cli template add docs`}
      includes={["Sidebar navigation", "Table of contents", "⌘K search", "Reading progress", "Callouts", "CodeBlock"]}
      preview={
        <Card className="w-full p-3">
          <div className="grid grid-cols-[120px_1fr_100px] gap-3 text-xs">
            <div className="rounded-md border border-border/50 bg-subtle/40 p-2">Sidebar</div>
            <div className="rounded-md border border-border/50 p-2">
              <p className="font-semibold">Article</p>
              <p className="mt-1 text-muted-foreground">MDX-friendly.</p>
            </div>
            <div className="rounded-md border border-border/50 p-2">TOC</div>
          </div>
        </Card>
      }
      source={`// src/routes/docs.$.tsx — catch-all doc route
import { DocsShell } from "@/components/docs/docs-shell";

export const Route = createFileRoute("/docs/$")({
  loader: ({ params }) => loadDoc(params._splat),
  component: DocPage,
});

function DocPage() {
  const { doc } = Route.useLoaderData();
  return <DocsShell title={doc.title} toc={doc.toc}>{doc.body}</DocsShell>;
}`}
    />
  );
}
