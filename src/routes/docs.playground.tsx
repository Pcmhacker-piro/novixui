import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge, Button, Card } from "@/nova";
import { DocsShell, DocSection, DocLead } from "@/components/docs/docs-shell";
import { Playground } from "@/components/docs/playground";

export const Route = createFileRoute("/docs/playground")({
  component: PlaygroundPage,
  head: () => ({
    meta: [
      { title: "Playground · Novix UI" },
      { name: "description", content: "Try every Nova component in a live sandbox. Every prop, every state, instant preview." },
      { property: "og:title", content: "Playground · Novix UI" },
      { property: "og:description", content: "Try every Nova component in a live sandbox. Every prop, every state, instant preview." },
    ],
  }),
});

function PlaygroundPage() {
  return (
    <DocsShell
      eyebrow="Explore"
      title="Playground"
      description="A live sandbox for every Nova primitive. Change any prop; the preview updates instantly."
      toc={[
        { id: "button", label: "Button" },
        { id: "badge", label: "Badge" },
        { id: "card", label: "Card" },
      ]}
    >
      <DocLead>
        These are the same components you'll ship. Toggle a prop, watch it recompose, then copy the
        config into your app.
      </DocLead>

      <DocSection id="button" title="Button">
        <Playground
          controls={[
            {
              kind: "select",
              key: "variant",
              label: "Variant",
              options: ["primary", "accent", "secondary", "outline", "ghost", "destructive"],
              defaultValue: "primary",
            },
            { kind: "select", key: "size", label: "Size", options: ["sm", "md", "lg"], defaultValue: "md" },
            { kind: "switch", key: "loading", label: "Loading", defaultValue: false },
            { kind: "switch", key: "trailing", label: "Trailing icon", defaultValue: true },
          ]}
        >
          {(s) => (
            <Button
              variant={s.variant as "primary"}
              size={s.size as "md"}
              loading={Boolean(s.loading)}
              trailingIcon={s.trailing ? <ArrowRight /> : undefined}
              leadingIcon={<Sparkles />}
            >
              Continue
            </Button>
          )}
        </Playground>
      </DocSection>

      <DocSection id="badge" title="Badge">
        <Playground
          controls={[
            {
              kind: "select",
              key: "variant",
              label: "Variant",
              options: ["default", "accent", "outline", "success", "warning", "danger"],
              defaultValue: "accent",
            },
            { kind: "select", key: "size", label: "Size", options: ["sm", "md"], defaultValue: "md" },
            { kind: "switch", key: "dot", label: "Status dot", defaultValue: true },
          ]}
        >
          {(s) => (
            <Badge
              // @ts-expect-error — playground values narrow at runtime
              variant={s.variant}
              // @ts-expect-error — playground values narrow at runtime
              size={s.size}
              dot={Boolean(s.dot)}
            >
              New feature
            </Badge>
          )}
        </Playground>
      </DocSection>

      <DocSection id="card" title="Card">
        <Playground
          controls={[
            { kind: "slider", key: "padding", label: "Padding", min: 12, max: 40, step: 2, defaultValue: 24, unit: "px" },
            { kind: "slider", key: "radius", label: "Radius", min: 6, max: 28, step: 1, defaultValue: 14, unit: "px" },
          ]}
        >
          {(s) => (
            <Card
              className="w-72"
              style={{ padding: Number(s.padding), borderRadius: Number(s.radius) }}
            >
              <p className="text-sm font-semibold">Aurora launched</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                A new era of themed depth is available in v0.2.
              </p>
            </Card>
          )}
        </Playground>
      </DocSection>
    </DocsShell>
  );
}
