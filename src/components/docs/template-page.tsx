import { type ReactNode } from "react";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "./callout";
import { Badge } from "@/nova";

/**
 * Nova docs · Template page — hero preview + install instructions +
 * composition breakdown. Used across every template route.
 */
export function TemplatePage({
  eyebrow,
  title,
  description,
  preview,
  install,
  source,
  includes,
  routes,
  notes,
}: {
  eyebrow: string;
  title: string;
  description: string;
  preview: ReactNode;
  install: string;
  source: string;
  includes: string[];
  routes?: string[];
  notes?: string;
}) {
  return (
    <DocsShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      toc={[
        { id: "preview", label: "Preview" },
        { id: "install", label: "Install" },
        { id: "source", label: "Source" },
        { id: "includes", label: "What's included" },
      ]}
    >
      <DocSection id="preview" title="Preview">
        <DocLead>Every element on the page is a Nova primitive. Adjust tokens in <code className="rounded bg-subtle px-1 font-mono text-[12.5px]">src/styles.css</code>.</DocLead>
        <ComponentPreview className="mt-6" align="start" code={source}>{preview}</ComponentPreview>
      </DocSection>

      <DocSection id="install" title="Install">
        <p className="text-sm text-muted-foreground">Pull the template with the Nova CLI.</p>
        <CodeBlock className="mt-3" code={install} />
        {routes?.length ? (
          <div className="mt-4">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Routes created</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {routes.map((r) => (
                <li key={r} className="font-mono text-[12.5px]">{r}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </DocSection>

      <DocSection id="source" title="Source">
        <CodeBlock code={source} />
      </DocSection>

      <DocSection id="includes" title="What's included">
        <div className="mt-2 flex flex-wrap gap-2">
          {includes.map((c) => (
            <Badge key={c} variant="outline" size="sm">{c}</Badge>
          ))}
        </div>
        {notes ? <Callout className="mt-6" variant="note" title="Notes">{notes}</Callout> : null}
      </DocSection>
    </DocsShell>
  );
}
