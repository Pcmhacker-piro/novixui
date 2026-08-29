import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, Separator } from "@/nova";
import { TemplatePage } from "@/components/docs/template-page";

export const Route = createFileRoute("/docs/templates/blog")({
  component: BlogTemplate,
  head: () => ({ meta: [{ title: "Blog template · Novix UI" }, { name: "description", content: "A minimal, typography-first blog." }] }),
});

function BlogTemplate() {
  return (
    <TemplatePage
      eyebrow="Templates · Content"
      title="Blog"
      description="A calm, reading-first blog — mono eyebrow, editorial typography, and inline callouts."
      install={`npx @novix-ui/cli template add blog`}
      includes={["Post index", "Post detail", "Reading time", "Callouts", "RSS feed"]}
      preview={
        <div className="w-full space-y-3">
          {[
            { t: "Designing Nova's material system", d: "How layered shadows and mask-composited highlights make interfaces feel physical." },
            { t: "Motion as UX", d: "Spring physics beat curves. Here's why we shipped snap, soft, and glide." },
          ].map((p) => (
            <Card key={p.t} className="p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Essay · 6 min</p>
              <p className="mt-1 text-sm font-semibold">{p.t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.d}</p>
              <Separator className="my-3" />
              <div className="flex items-center gap-2">
                <Badge variant="outline" size="sm">design</Badge>
                <Badge variant="outline" size="sm">motion</Badge>
              </div>
            </Card>
          ))}
        </div>
      }
      source={`// src/routes/blog.$slug.tsx
export function Post() {
  const { post } = Route.useLoaderData();
  return (
    <article className="prose mx-auto max-w-2xl py-12">
      <p className="eyebrow">{post.category} · {post.readingTime}</p>
      <h1>{post.title}</h1>
      {post.body}
    </article>
  );
}`}
    />
  );
}
