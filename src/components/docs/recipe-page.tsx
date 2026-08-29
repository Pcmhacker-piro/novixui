import { type ReactNode } from "react";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { ComponentPreview } from "@/components/docs/preview";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout, type CalloutVariant } from "./callout";

/**
 * Nova docs · Recipe shell — consistent structure for recipe pages.
 * Every recipe has: preview → source → anatomy → callout tip → related links.
 */
export function RecipePage({
  eyebrow,
  title,
  description,
  preview,
  source,
  anatomy,
  tip,
  related,
}: {
  eyebrow: string;
  title: string;
  description: string;
  preview: ReactNode;
  source: string;
  anatomy: string[];
  tip?: { variant?: CalloutVariant; title: string; body: string };
  related?: { title: string; href: string }[];
}) {
  return (
    <DocsShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      toc={[
        { id: "preview", label: "Preview" },
        { id: "source", label: "Source" },
        { id: "anatomy", label: "Anatomy" },
        ...(related?.length ? [{ id: "related", label: "Related" }] : []),
      ]}
    >
      <DocSection id="preview" title="Preview">
        <DocLead>The exact composition below is what ships in production apps built on Nova.</DocLead>
        <ComponentPreview className="mt-6" align="start" code={source}>
          {preview}
        </ComponentPreview>
      </DocSection>

      <DocSection id="source" title="Source">
        <CodeBlock code={source} />
      </DocSection>

      <DocSection id="anatomy" title="Anatomy">
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          {anatomy.map((a) => (
            <li key={a} className="flex gap-2">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
        {tip ? (
          <Callout className="mt-6" variant={tip.variant ?? "tip"} title={tip.title}>
            {tip.body}
          </Callout>
        ) : null}
      </DocSection>

      {related?.length ? (
        <DocSection id="related" title="Related">
          <ul className="mt-2 space-y-2 text-sm">
            {related.map((r) => (
              <li key={r.href}>
                <a className="text-accent underline-offset-4 hover:underline" href={r.href}>
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </DocSection>
      ) : null}
    </DocsShell>
  );
}
